import { throttle } from "@/utils"
export default {
    mounted() {
      // this.setDialogWidth()
      window.onresize = throttle(this.setDialogWidth,300)
    },
    methods: {
      setDialogWidth() {
          console.log('当前平步宽度',document.body.clientWidth)
          let val = document.body.clientWidth
          const def = 1200 // 默认宽度
          if (val <= (def + 20)) {
            this.$store.dispatch('settings/setDialogWidth', '900px')
          } else {
            if(val <= 1420) {
              this.$store.dispatch('settings/setDialogWidth', '1200px')
            }else if(val <= 1620) {
              this.$store.dispatch('settings/setDialogWidth', '1400px')
            }else {
              this.$store.dispatch('settings/setDialogWidth', '1600px')
            }
          }
          console.log('当前平步宽度',document.body.clientWidth,this.$store.state.settings.dialogWidth)
      }
    }
}