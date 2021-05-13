
Vue.component('image-picker', {
    props: ['id'],
    data: function () {
      return {
        image:null, image_url:`http://placekitten.com/g/300/${300 + this.id}`
      }
    },
    template: `
      <div>
        <img :id=id :src=image_url>
        <button class="text-center text-xs text-gray-600 hover:text-blue-400 btn btn-info" @click="pickFile">select image for {{id}}</button>
        <input
          type="file"
          style="display: none"
          ref="fileInput"
          accept="*"
          @change="onFilePicked"/>
      
      
      </div>
      `,
    methods: {
        pickFile: function pickFile()
        {
        this.$refs.fileInput.click()
        },
      onPickFile () {
        this.$refs.fileInput.click()
      },
      onFilePicked (event) {
        const files = event.target.files
        let filename = files[0].name
        const fileReader = new FileReader()
        fileReader.addEventListener('load', () => {
          this.image_url = fileReader.result
        })
        fileReader.readAsDataURL(files[0])
        this.image = files[0]
      }
    }
  })



var app = new Vue({
    el: '#app',
    data: {
    }
})