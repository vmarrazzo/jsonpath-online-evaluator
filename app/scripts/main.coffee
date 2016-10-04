class JsonPathOnlineEvaluator

  constructor: ->
    @editor = ace.edit("json-editor");
    @editor.setTheme("ace/theme/solarized_dark");
    @editor.getSession().setMode("ace/mode/json");

    @resultEditor = ace.edit("result-editor");
    @resultEditor.setTheme("ace/theme/solarized_dark");
    @resultEditor.setReadOnly(true);

    $('input[name=jsonpath]').on 'textchange', @evaluate
    @editor.on 'change', @evaluate

    $('input[name=url]').on 'textchange', @fetch

    @evaluate()
    $.growl.notice({ message: "Test your JSON Path query!", size: "large" })

  fetch: =>
    $.ajax 
      url: '/fetch-url'
      type: 'POST'
      dataType: 'json'
      data :
       url: $('input[name=url]').val()
      success  : (data, status, xhr) ->
          console.log("yea "+data)
          # ???? .replace("undefined", "")
          ace.edit("json-editor").setValue(JSON.stringify(data,null,4))
      error    : (xhr, status, err) ->
          console.log("nah "+err)
          $.growl.error({ message: "Error when fetch JSON from Url!", size: "large" })
      complete : (xhr, status) ->
          console.log("comp")

  evaluate: =>
    query = $('input[name=jsonpath]').val()
    json_str = @editor.getValue()

    try
      json = JSON.parse(json_str.replace(/(\r\n|\n|\r)/gm, ''))
      $('#json-area').removeClass('has-error');
      $('#json-alert').text('');
    catch
      @resultEditor.getSession().setValue 'Json Parse Error'
      return

    try
      result = JSONPath(
        json: json
        path: query
      )
      $('input[name=jsonpath]').removeClass('jsonpath-error');
    catch
      $('input[name=jsonpath]').addClass('jsonpath-error');
      @resultEditor.getSession().setValue 'JSON Path Error'
      $.growl.error({ message: "JSON Path Error!", size: "large" })
      return

    unless _.isEmpty(result)
      @resultEditor.getSession().setValue dump(result)
    else
      @resultEditor.getSession().setValue 'No match'

$ ->
  new JsonPathOnlineEvaluator()
