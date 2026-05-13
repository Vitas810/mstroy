import { createApp } from 'vue'
import App from './App.vue'
import '@/assets/scss/main.scss'

import {
    ModuleRegistry,
    AllEnterpriseModule,
} from 'ag-grid-enterprise'

ModuleRegistry.registerModules([
    AllEnterpriseModule,
])

createApp(App).mount('#app')