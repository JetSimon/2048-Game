
Vue.component('image-picker', {
    props: ['id'],
    data: function () {
      return {
        image:null, image_url:`https://picsum.photos/300/${(Math.round(300 + Math.random() * 10)).toString()}`,
      }
    },
    template: `
      <div class="transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-110 shadow-lg w-40 my-5">
        <div class="w-40 h-40 relative">
          <img class="object-contain w-40 h-40 rounded-t-sm" :id=id :src=image_url>
          <p class="no-select py-1 px-2 bg-black bg-opacity-30 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-5xl text-center font-bold text-white">{{id}}</p>
        </div>
        
        <button class="rounded-b-sm w-40 bg-gray-300 hover:bg-gray-200 py-2 px-3 text-center text-xs font-semibold text-gray-800 hover:text-blue-400 btn btn-info" @click="pickFile">select image for {{id}}</button>

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