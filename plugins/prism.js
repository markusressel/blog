import Prism from 'prismjs'

import 'prismjs/plugins/line-numbers/prism-line-numbers'
import 'prismjs/plugins/line-highlight/prism-line-highlight'
import 'prismjs/plugins/match-braces/prism-match-braces'

/* Add language imports for the languages you want to highlight need HERE */
import 'prismjs/components/prism-bash'
import 'prismjs/components/prism-diff'
import 'prismjs/components/prism-go'
import 'prismjs/components/prism-kotlin'
import 'prismjs/components/prism-markdown'
import 'prismjs/components/prism-python'
import 'prismjs/components/prism-shell-session'
import 'prismjs/components/prism-yaml'
import 'prismjs/components/prism-core'

// TODO: not working because of: Prism.plugins.autolinker is undefined
// import 'prismjs/plugins/autolinker/prism-autolinker'
// import 'prismjs/plugins/autoloader/prism-autoloader'
import 'prismjs/plugins/toolbar/prism-toolbar'
import 'prismjs/plugins/copy-to-clipboard/prism-copy-to-clipboard'
import 'prismjs/plugins/treeview/prism-treeview'
import 'prismjs/plugins/line-numbers/prism-line-numbers'
import 'prismjs/plugins/show-language/prism-show-language'
import 'prismjs/plugins/line-highlight/prism-line-highlight'
import 'prismjs/plugins/diff-highlight/prism-diff-highlight'

// import 'prism-themes/themes/prism-vsc-dark-plus.css'
import 'prism-themes/themes/prism-coldark-dark.css'

export default Prism
