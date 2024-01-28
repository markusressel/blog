---
createdAt: 2024-01-28
updatedAt: 2024-01-28
title: Calendar integration betwen Home Assistant and AppDaemon
img: https://images.unsplash.com/photo-1616530834117-9167fb0d8ebc?q=80&w=2531&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D
alt: Calendar integration betwen Home Assistant and AppDaemon
authors:
  - Markus Ressel
tags:
  - homeassistant
  - appdaemon
  - python
---

Creating automations based on events in your calendar can enhance the autonomy of your Home Assistant setup quite a lot. Setting it up using AppDaemon is - sadly - not straight forward though.

<!--more-->

## What's the Problem?

[AppDaemon][3] does not (yet) use the Websocket API that [Home Assistant][2] itself uses for its frontend, but the REST Api instead. While this is fine for most things, the REST Api is not officially supported anymore.
Since the calendar services to create automations have been introduced much later than this technological shift, using calendar services like `calendar.get_events` doesn't quite work when using the REST Api.
If you would like to see this change, have a look at [this issue][1] and give it a 👍 (but please don't comment "I need this too", it spams all participants of the issue)!

## The Workaround

There is, however, a way to work around this.

Instead of directly querying the calendar service from [AppDaemon][3], we call
a script within [Home Assistant][2], which internally calls the calendar service and sends the result
back to [AppDaemon][3] as an "event".

To get this running we first need to create our "wrapper script":

```yaml[get_calendar_events.yaml]
alias: get_calendar_events
sequence:
  - service: calendar.get_events
    data:
      start_date_time: '{{ start_date_time }}'
      duration:
        hours: '{{ duration.hours }}'
        minutes: '{{ duration.minutes }}'
        seconds: '{{ duration.seconds }}'
    response_variable: calendar_get_events_result
    target:
      entity_id: '{{ calendar_entity_id }}'
  - variables:
      event_entries: '{{ calendar_get_events_result[calendar_entity_id].events }}'
  - event: custom_appdaemon_get_calendar_events_result
    event_data_template:
      data: '{{ calendar_get_events_result }}'
mode: queued
max: 10
fields:
  calendar_entity_id:
    selector:
      entity: {}
    name: Calendar Entity ID
    description: The entity ID of the calendar to query.
    required: true
  start_date_time:
    selector:
      datetime: {}
    name: Start Date Time
    description: >-
      Return active events after this time (exclusive). When not set, defaults
      to now.
    required: false
  duration:
    selector:
      duration:
        enable_day: false
    name: Duration
    required: false
    description: Return active events from start_date_time until the specified duration.
    default:
      hours: 24
      minutes: 0
      seconds: 0
```

You can trigger this script directly from [Home Assistant][2], but since we want to be able to trigger the query from [AppDaemon][3],
we need to call a script and wait for an event to get the result. To make this a little easier I use these helper functions:

```python[calendar_utils.py]
from datetime import datetime, timedelta
from typing import Optional, Dict, Callable

import appdaemon.plugins.hass.hassapi as hass

from util import util_common


async def get_calendar_events(
    controller: hass.Hass,
    entity_id: str,
    start: Optional[datetime] = None,
    end: Optional[datetime] = None,
    duration: Optional[timedelta] = None,
) -> Dict:
    """
    Get calendar events between two dates
    :param controller: usually 'self'
    :param entity_id: the calendar entity to query
    :param start: Return active events after this time (exclusive). When not set, defaults to now.
    :param end: Return active events before this time (exclusive). Cannot be used with duration. You must specify either end_date_time or duration.
    :param duration: Return active events from start_date_time until the specified duration. Cannot be used with end_date_time. You must specify either duration or end_date_time
    """

    args = {}
    if start is not None:
        args["start_date_time"] = start.isoformat()
    # if end is not None:
    #    args["end_date_time"] = end.isoformat()
    if duration is not None:
        hours = (duration.days * 24) + (duration.seconds // 3600)
        minutes = (duration.seconds // 60) % 60
        seconds = duration.seconds % 60

        duration_args = {}
        duration_args["hours"] = hours
        duration_args["minutes"] = minutes
        duration_args["seconds"] = seconds

        args["duration"] = duration_args

    controller.log(f"Getting calendar events for {entity_id} with args: {args}")

    # workaround using a wrapper script, see: https://github.com/appdaemon/appdaemon/issues/1837
    await util_common.run_script(
        controller=controller,
        name="get_calendar_events",
        variables={
            "calendar_entity_id": entity_id,
            **args
        }
    )

    # FIXME: not yet supported by appdaemon, see: https://github.com/appdaemon/appdaemon/issues/1837
    # return await controller.call_service(
    #     "calendar/get_events",
    #     entity_id=entity_id,
    #     **args,
    #     return_result=True,
    # )


async def register_calendar_event_callback(
    controller: hass.Hass,
    callback: Callable,
) -> None:
    """
    Register a callback to be called when a calendar event is received
    :param controller: usually 'self'
    :param callback: callback to call when an event is received
    :return: A handle that can be used to cancel the callback.
    """
    return await controller.listen_event(callback, "custom_appdaemon_get_calendar_events_result")
```

Since we need to keep track of event data within [AppDaemon][3], I also created an App for this exact purpose, called `CalendarController`:

```yaml[calendar.yaml]
---
calendar_controller:
  module: calendar_controller
  class: CalendarController
...
```

```python[calendar_controller.py]
from datetime import datetime, timedelta
from typing import Dict, Callable, List

from base import BaseApp
from const import *
from util import util_calendar


# Used to keep track of calendar events
# and help with tracking event states.
class CalendarController(BaseApp):

    async def initialize(self):
        # used to keep track of calendar data
        self._calendar_data = {}
        # used to keep track of callbacks
        self._state_callbacks = {}
        await util_calendar.register_calendar_event_callback(
            controller=self,
            callback=self._on_calendar_events_callback
        )

        await self._update_calendar_events(None, None, None, None, None)
        # this essentially runs every minute
        await self.listen_state(self._update_calendar_events, "sensor.date_time")

    async def _on_calendar_events_callback(self, event_id, payload_event, *args):
        self.log(f"Received calendar result event '{event_id}': {payload_event}")
        self._calendar_data = payload_event["data"]

        for key, callback_data in self._state_callbacks.items():
            callback = callback_data["callback"]
            condition = callback_data["condition"]
            if condition is not None:
                if condition():
                    await callback()
            else:
                await callback()

    async def _update_calendar_events(self, entity, attribute, old, new, kwargs):
        # query data for all of the calendar entities you are interested in
        await util_calendar.get_calendar_events(
            controller=self,
            entity_id=CALENDAR_IRIS_MARKUS_ENTITY,
            start=datetime.now(),
            duration=timedelta(hours=720) # events within the coming 30 days
        )

    async def get_current_events(self, calendar_id: str or None = None) -> List[Dict]:
        """
        Get a list of all current events for a calendar
        :param calendar_id: the id of the calendar, if None, all calendars are queried
        :return: a list of events
        """
        result = []
        for cid, calendar_data in self._calendar_data.items():
            if calendar_id is not None and cid != calendar_id:
                continue
            calendar_events = calendar_data.get("events", [])
            result.extend(calendar_events)

        result = [event for event in result if
                  datetime.fromisoformat(
                      event["start"]).timestamp() < datetime.now().timestamp() < datetime.fromisoformat(
                      event["end"]).timestamp()]
        return result

    async def register_state_callback(self, key: str, callback: Callable, condition: Callable or None = None):
        """
        Register a callback to be called when the state of the calendar changes
        and the value of the condition changed.
        :param key: the key of the callback
        :param callback: the callback to call
        :param condition: the condition to check, returns True or False
        """
        self._state_callbacks[key] = {
            "callback": callback,
            "condition": condition
        }
```

In an actual [AppDaemon][3] app, the usage would then look like this:

```yaml[living_room.yaml]
---
living_room_controller:
  module: living_room
  class: LivingRoomController
  dependencies:
    - calendar_controller
...
```

```python[living_room.py]
class LivingRoomController(BaseApp):

    async def initialize(self):
        ...

        calendar_controller = await self.get_app("calendar_controller")
        await calendar_controller.register_state_callback("living_room", self._calendar_data_changed_callback)

        # this essentially runs every minute
        await self._check_calendar_events(None, None, None, None, None)
        await self.listen_state(self._check_calendar_events, "sensor.date_time")

    async def _calendar_data_changed_callback(self):
        await self._check_calendar_events(None, None, None, None, None)

    async def _check_calendar_events(self, entity, attribute, old, new, kwargs):
        calendar_controller = await self.get_app("calendar_controller")
        current_events = await calendar_controller.get_current_events()

        # TODO: do something with the events

```

[1]: https://github.com/appdaemon/appdaemon/issues/1837
[2]: https://www.home-assistant.io/
[3]: https://github.com/appdaemon/appdaemon
