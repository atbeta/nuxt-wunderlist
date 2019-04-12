import Vue from 'vue'
import DatePicker from 'ant-design-vue/lib/date-picker'
import Button from 'ant-design-vue/lib/button'
import Drawer from 'ant-design-vue/lib/drawer'

export default () => {
  Vue.use(DatePicker)
  Vue.use(Button)
  Vue.use(Drawer)
}
