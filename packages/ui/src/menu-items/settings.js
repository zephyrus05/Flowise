// assets
import { IconTrash, IconFileUpload, IconFileExport, IconCopy, IconSearch, IconMessage } from '@tabler/icons'

// constant
const icons = { IconTrash, IconFileUpload, IconFileExport, IconCopy, IconSearch, IconMessage }

// ==============================|| SETTINGS MENU ITEMS ||============================== //

const settings = {
    id: 'settings',
    title: '',
    type: 'group',
    children: [
        {
            id: 'viewMessages',
            title: 'View Messages',
            type: 'item',
            url: '',
            icon: icons.IconMessage
        },
        {
            id: 'duplicateChatflow',
            title: 'Duplicate Workspace',
            type: 'item',
            url: '',
            icon: icons.IconCopy
        },
        {
            id: 'loadChatflow',
            title: 'Load Workspace',
            type: 'item',
            url: '',
            icon: icons.IconFileUpload
        },
        {
            id: 'exportChatflow',
            title: 'Export Workspace',
            type: 'item',
            url: '',
            icon: icons.IconFileExport
        },
        {
            id: 'analyseChatflow',
            title: 'Analyse Workspace',
            type: 'item',
            url: '',
            icon: icons.IconSearch
        },
        {
            id: 'deleteChatflow',
            title: 'Delete Workspace',
            type: 'item',
            url: '',
            icon: icons.IconTrash
        }
    ]
}

export default settings
