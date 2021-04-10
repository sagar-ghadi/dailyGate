function process_post_request(request_data, callback)
{
  $.ajax({
    url:request_data.url,
    type: 'POST',
    dataType: 'JSON',
    data: request_data.data,
    success: function(data){
      data.success = true;
      callback(data);
    },
    error: function(xhr, ex){
      var title = '';
      var msg = '';
      if(xhr.status == 0){
        title = 'No Internet Access.';
        msg = 'Please check your network, and try again.';
      }else if(xhr.status == 404){
        title = 'Page Not Found [404]';
        msg = 'Requested page cannot be reached.';
      }else if(xhr.status == 500){
        title = 'Internal Server Error [500]';
        msg = 'Server side error has occured, please try after sometime.';
      }else if(ex === 'parseerror'){
        title = 'Parse Error';
        msg = 'Requested JSON parse failed, please try again.';
      }else if(ex === 'timeout'){
        title = 'Request Timeout';
        msg = 'Your request has been failed due to excess timeout.';
      }else if(ex === 'abort'){
        title = 'Aborted.';
        msg = 'Your request has been aborted by the server.';
      }else{
        title = 'Uncaught Exception.';
        msg = xhr.responseText;
      }
      var err_data = {};
      err_data.success = false;
      err_data.title = title;
      err_data.msg = msg;
      callback(err_data);
    }
  });
}

function process_get_request(request_data, callback)
{
  $.ajax({
    url:request_data.url,
    type: 'GET',
    dataType: 'JSON',
    data: request_data.data,
    success: function(data){
      data.success = true;
      callback(data);
    },
    error: function(xhr, ex){
      var title = '';
      var msg = '';
      if(xhr.status == 0){
        title = 'No Internet Access.';
        msg = 'Please check your network, and try again.';
      }else if(xhr.status == 404){
        title = 'Page Not Found [404]';
        msg = 'Requested page cannot be reached.';
      }else if(xhr.status == 500){
        title = 'Internal Server Error [500]';
        msg = 'Server side error has occured, please try submitting your form after sometime.';
      }else if(ex === 'parseerror'){
        title = 'Parse Error';
        msg = 'Requested JSON parse failed, please try again.';
      }else if(ex === 'timeout'){
        title = 'Request Timeout';
        msg = 'Your request has been failed due to excess timeout.';
      }else if(ex === 'abort'){
        title = 'Aborted.';
        msg = 'Your request has been aborted by the server.';
      }else{
        title = 'Uncaught Exception.';
        msg = xhr.responseText;
      }
      var err_data = {};
      err_data.success = false;
      err_data.title = title;
      err_data.msg = msg;
      callback(err_data);
    }
  });
}

function uploadFileData(form, progressbar, callback)
{
  $(form).ajaxSubmit({
    dataType: 'JSON',
    beforeSubmit: function(){
      $(progressbar).children().html('0%');
    },
    uploadProgress: function(event, position, total, percentComplete){
      $(progressbar).children().html(percentComplete +'%');
      $(progressbar).children().css('min-width', percentComplete+'%');
    },
    success: function(data){
      data.success = true;
      callback(data);
    },
    error: function(xhr, ex){
      var title = '';
      var msg = '';
      if(xhr.status == 0){
        title = 'No Internet Access.';
        msg = 'Please check your network, and try again.';
      }else if(xhr.status == 404){
        title = 'Page Not Found [404]';
        msg = 'Requested page cannot be reached.';
      }else if(xhr.status == 500){
        title = 'Internal Server Error [500]';
        msg = 'Server side error has occured, please try submitting your form after sometime.';
      }else if(ex === 'parseerror'){
        title = 'Parse Error';
        msg = 'Requested JSON parse failed, please try again.';
      }else if(ex === 'timeout'){
        title = 'Request Timeout';
        msg = 'Your request has been failed due to excess timeout.';
      }else if(ex === 'abort'){
        title = 'Aborted.';
        msg = 'Your request has been aborted by the server.';
      }else{
        title = 'Uncaught Exception.';
        msg = xhr.responseText;
      }
      var err_data = {};
      err_data.success = false;
      err_data.title = title;
      err_data.msg = msg;
      callback(err_data);
    }
  });
}


function process_post_request_custom(request_data, callback)
{
  $.ajax({
    url:request_data.url,
    type: 'POST',
    data: request_data.data,
    success: function(data){
      data.success = true;
      callback(data);
    },
    error: function(xhr, ex){
      var title = '';
      var msg = '';
      if(xhr.status == 0){
        title = 'No Internet Access.';
        msg = 'Please check your network, and try again.';
      }else if(xhr.status == 404){
        title = 'Page Not Found [404]';
        msg = 'Requested page cannot be reached.';
      }else if(xhr.status == 500){
        title = 'Internal Server Error [500]';
        msg = 'Server side error has occured, please try after sometime.';
      }else if(ex === 'parseerror'){
        title = 'Parse Error';
        msg = 'Requested JSON parse failed, please try again.';
      }else if(ex === 'timeout'){
        title = 'Request Timeout';
        msg = 'Your request has been failed due to excess timeout.';
      }else if(ex === 'abort'){
        title = 'Aborted.';
        msg = 'Your request has been aborted by the server.';
      }else{
        title = 'Uncaught Exception.';
        msg = xhr.responseText;
      }
      var err_data = {};
      err_data.success = false;
      err_data.title = title;
      err_data.msg = msg;
      callback(err_data);
    }
  });
}
