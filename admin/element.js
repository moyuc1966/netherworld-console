import Vue from 'vue'
import { Button } from 'element-ui'
import {
    form, FormItem, Input, Message, Loading, Container, Header, Aside, Main,
    DropdownItem, DropdownMenu, Dropdown, Dialog, Menu, Submenu, MenuItem, Card, Table, TableColumn, Pagination,
    Tag, Image, Cascader, RadioGroup, RadioButton, DatePicker, Switch, TimePicker, MessageBox, Notification, Radio, Tooltip, Select, Option,
    Upload

} from 'element-ui'

Vue.use(Button)
Vue.use(form)
Vue.use(FormItem)
Vue.use(Input)
// Vue.use(Message)
Vue.prototype.$message = Message;
Vue.prototype.$loading = Loading.service;
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
Vue.use(DropdownItem)
Vue.use(DropdownMenu)
Vue.use(Dropdown)
Vue.use(Dialog)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItem)
Vue.use(Card)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Tag)
Vue.use(Pagination)
Vue.use(Image)
Vue.use(Cascader)
Vue.use(RadioButton)
Vue.use(RadioGroup)
Vue.use(DatePicker)
Vue.use(Switch)
Vue.use(Radio)
Vue.use(Tooltip)
Vue.use(TimePicker)
Vue.use(Select)
Vue.use(Option)
Vue.use(Upload)
Vue.prototype.$confirm = MessageBox.confirm;
Vue.prototype.$prompt = MessageBox.prompt;
Vue.prototype.$alert = MessageBox.alert;
Vue.prototype.$notify = Notification;

