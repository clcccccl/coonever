module.exports =
  Vue.extend
    template: require('./template.html')
    data:->
      editor: null
    events:
      content_changed:(content) ->
        @editor.setValue content
    attached:->
      @editor = new Simditor
        textarea: $('#editor')
        toolbar:['title'
          'bold'
          'italic'
          'underline'
          'strikethrough'
          'fontScale'
          'color'
          'ol'
          'ul'
          'blockquote'
          'code'
          'link'
          'alignment'
        ]
        codeLanguages:[
          { name: 'C++', value: 'c++' }
          { name: 'CSS', value: 'css' }
          { name: 'Less', value: 'less' }
          { name: 'CoffeeScript', value: 'coffeescript' }
          { name: 'HTML,XML', value: 'html' }
          { name: 'JSON', value: 'json' }
          { name: 'Java', value: 'java' }
          { name: 'JavaScript', value: 'js' }
          { name: 'Objective C', value: 'oc' }
          { name: 'Python', value: 'python' }
          { name: 'SQL', value: 'sql'}
        ]
      @editor.on 'valuechanged', (e, src) =>
        @$dispatch('valuechanged', @editor.getValue())
