require('./style.less')

module.exports =
  Vue.extend
    template: require('./template.html')
    directives:
      'user-head': require('../../directives/user_head')
    props: ['file']
    data:->
      new_file:null
      append_files:[]
    methods:
      upload:->
        files = @$els.newfile.files
        data = new FormData()
        text_list = files[0]['name'].split(".")
        if text_list.length < 2
        	cl.noticeWarning('系统无法识别你所选择的文件，请从新选择!')
        	return
        file_suffix = text_list[text_list.length-1]
        if file_suffix not in ['png', 'svg', 'jpg', 'JPG']
        	cl.noticeWarning('请选择图片文件!')
        	return
        data.append('file', files[0])
        data.append('size', files[0]['size'])
        data.append('file_type', 'user_head')
        data.append('file_suffix', file_suffix)
        $.ajax
          url: '/file_upload'
          type: 'POST'
          data : data
          processData: false
          contentType: false
          success: (data, status, response) =>
          	if data.error == '1'
          	  cl.noticeError('文件上传失败')
          	else
          	  cl.noticeSuccess('文件上传成功')
