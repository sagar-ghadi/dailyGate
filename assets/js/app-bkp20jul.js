if($("#myBtnGoup").length !== 0 ) {
  window.onscroll = function() {scrollFunction()};
  function scrollFunction() {
      if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
          document.getElementById("myBtnGoup").style.display = "block";
      } else {
          document.getElementById("myBtnGoup").style.display = "none";
      }
  }
}

// When the user clicks on the button, scroll to the top of the document
function topFunction() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
}

var path = $("#host").val();
var logged_associate_id=$("#v_m_associate_id").val();
//alert(logged_associate_id);
// Associate >  Notice > get all notice list
var getanoticelistcount=0;
function getNotice(){
    var request_data = {};
    request_data.data = {};
    request_data.url = path+'associate/notice/get_my_all_notice';
    request_data.data.jwt = $.cookie('jwt');
    process_post_request(request_data, function(json){
        if(json.success){
            var str='';
            if(json.status == 200){
                  $.each(json.list, function(key, val){
                      str += `<tr>
                            <td>
                                {"notice_id": "${val.id}", "subject": "${val.subject}", "notice": "${val.notice}", "notice_end_date": "${val.notice_end_date}", "creator_name": "${val.creator[0].name}", "creator_id": "${val.creator[0].id}", "created_at": "${val.created_at}", "updated_at": "${val.updated_at}"}
                            </td>
                          </tr>`;
                  });
                  $('#a-notice_list-datatable-body').html(str);
                  if(!getanoticelistcount){
                    $("#a-notice_list-datatable").bootgrid({
                          css: {
                              icon: 'zmdi icon',
                              iconColumns: 'zmdi-view-module',
                              iconDown: 'zmdi-expand-more',
                              iconRefresh: 'zmdi-refresh',
                              iconUp: 'zmdi-expand-less'
                          },
                         formatters: {
                              "t_list": function(column, row) {
                                   str = JSON.parse(row.tlist);
                                   outp = `<div class="card c-dark z-depth-1" style="margin-bottom: 0px !important;">
                                              <div class="card-body card-padding">
                                                  <div class="row">
                                                    <div class="col-md-9">
                                                        <p class="c-black text-justify">Subject : ${str.subject}</p>
                                                        <p class="c-black text-justify">
                                                           Notice: ${str.notice}
                                                        </p>
                                                        <p class="c-black text-justify">
                                                           Notice end date: ${str.notice_end_date}
                                                        </p>
                                                    </div>
                                                    <div class="col-md-3">
                                                       <button class="m-b-15 btn btn-block btn-default btn-icon-text waves-effect" onclick="editNotice('${str.notice_id}'); return false;"><i class="zmdi zmdi-edit"></i> Edit Notice</button><br>
                                                        <button class="btn btn-block btn-default btn-icon-text waves-effect" onclick="deleteNotice('${str.notice_id}'); return false;"><i class="zmdi zmdi-delete"></i> Delete Notice</button>
                                                    </div>
                                                  </div>
                                              </div>
                                          </div>`;
                                   return outp;
                              }
                          }
                    });
                  }else {
                    $("#a-notice_list-datatable").bootgrid('destroy');
                    $('#a-notice_list-datatable-body').html(str);
                    $("#a-notice_list-datatable").bootgrid({
                          css: {
                              icon: 'zmdi icon',
                              iconColumns: 'zmdi-view-module',
                              iconDown: 'zmdi-expand-more',
                              iconRefresh: 'zmdi-refresh',
                              iconUp: 'zmdi-expand-less'
                          },
                         formatters: {
                              "t_list": function(column, row) {
                                   str = JSON.parse(row.tlist);
                                   outp = `<div class="card c-dark z-depth-1" style="margin-bottom: 0px !important;">
                                              <div class="card-body card-padding">
                                                  <div class="row">
                                                    <div class="col-md-9">
                                                        <p class="c-black text-justify">Subject : ${str.subject}</p>
                                                        <p class="c-black text-justify">
                                                           Notice: ${str.notice}
                                                        </p>
                                                        <p class="c-black text-justify">
                                                           Notice end date: ${str.notice_end_date}
                                                        </p>
                                                    </div>
                                                    <div class="col-md-3">
                                                       <button class="m-b-15 btn btn-block btn-default btn-icon-text waves-effect" onclick="editNotice('${str.notice_id}'); return false;"><i class="zmdi zmdi-edit"></i> Edit Notice</button><br>
                                                        <button class="btn btn-block btn-default btn-icon-text waves-effect" onclick="deleteNotice('${str.notice_id}'); return false;"><i class="zmdi zmdi-delete"></i> Delete Notice</button>
                                                    </div>
                                                  </div>
                                              </div>
                                          </div>`;
                                   return outp;
                              }
                          }
                    });
                  }
            }else{
                if(!json.list){
                  str += `<tr>
                          <td colspan="4" class="text-center">No Record Found!</td>
                          </tr>`;
                }
                $('#a-notice_list-datatable-body').html(str);
                createPopUpNotificaton(json.msg, 'danger');
            }
        }else{
             createPopUpNotificaton(json.msg, 'danger');
        }
        getanoticelistcount++;
    });
}

// Associate Verify User
$("#associate-forgot-password").submit(function(e){
    e.preventDefault();
    var err = 0;
    var request_data = {};
    request_data.url = path+'associate/signin/reset_password';
    request_data.data = {};
    request_data.data.email = $.trim($("#email").val());
    request_data.data.mobile = $.trim($("#mobile").val());
    err += validateFormData(request_data.data.email, "#email", "Email");
    err += validateFormData(request_data.data.mobile, "#mobile", "Mobile No.");
    if(err == 0){
            form_btn_spinner_show($(this));
            process_post_request(request_data, function(json){
            $(".alert").remove();
            if(json.success){
                if(json.status == 200){
                    form_btn_spinner_hide("#associate-forgot-password", "Verify");
                    $("#email-div, #mobile-div, #subBtn").hide();
                    $("#associate-forgot-password").before("<div class='alert alert-success alert-dismissible' role='alert'>"+json.msg+"</div>");
                }else {
                    form_btn_spinner_hide("#associate-forgot-password", "<i class='zmdi zmdi-refresh zmdi-hc-fw'></i>");
                    $("#associate-forgot-password").before("<div class='alert alert-danger alert-dismissible' role='alert'>"+json.msg+"</div>");
                }
            }else{
                form_btn_spinner_hide("#associate-forgot-password", "<i class='zmdi zmdi-refresh zmdi-hc-fw'></i>");
                $("#associate-forgot-password").before("<div class='alert alert-danger alert-dismissible' role='alert'>"+json.msg+"</div>");
            }
        });
    }
});


// Associate update password
$("#associate-update-password").submit(function(e){
    e.preventDefault();
    var err = 0;
    var request_data = {};
    request_data.url = path+'associate/signin/update_new_password';
    request_data.data = {};
    request_data.data.associate_id = $.trim($("#associate_id").val());
    request_data.data.newpass = $.trim($("#newpass").val());
    request_data.data.newpassconf = $.trim($("#newpassconf").val());
    err += validateFormData(request_data.data.newpassconf, "#newpassconf", "Confirm Password");
    err += validateFormData(request_data.data.newpass, "#newpass", "New Password");
    if(err == 0){
            form_btn_spinner_show($(this));
            process_post_request(request_data, function(json){
            $(".alert").remove();
            if(json.success){
                if(json.status == 200){
                    form_btn_spinner_hide("#associate-update-password", "Update");
                    $("#newpass-div, #oldpass-div, #subBtn").hide();
                    $("#associate-update-password").before("<div class='alert alert-success alert-dismissible' role='alert'>"+json.msg+"</div>");
                }else {
                    form_btn_spinner_hide("#associate-update-password", "<i class='zmdi zmdi-refresh zmdi-hc-fw'></i>");
                    if(json.newpassconf){
                      $('#newpassconf').parent().addClass("has-error");
                      $('#newpassconf').next().remove();
                      $('#newpassconf').after(`<small class='text-danger'>${json.msg}</small>`);
                    } else {
                      $("#associate-update-password").before("<div class='alert alert-danger alert-dismissible' role='alert'>"+json.msg+"</div>");
                    }
                }
            }else{
                form_btn_spinner_hide("#associate-update-password", "<i class='zmdi zmdi-refresh zmdi-hc-fw'></i>");
                $("#associate-update-password").before("<div class='alert alert-danger alert-dismissible' role='alert'>"+json.msg+"</div>");
            }
        });
    }
});

// Associate messenger login
function loginMessengerAccount(email){
  var formData = new FormData();
  formData.append('userEmail', email);
  formData.append('userPassword', email);
  localStorage.removeItem("_r");
  localStorage.removeItem("T");
  $.ajax({
      "url": path+"messenger/registration/login/",
      "method": "POST",
      "headers": {
          "authorization": "Basic YWRtaW46MTIzNA==",
          "cache-control": "no-cache"
      },
      "processData": false,
      "contentType": false,
      "mimeType": "multipart/form-data",
      "data": formData,
      "success":function (response) {
          var data=JSON.parse(response);
          if(data.status.code==200 && data.status.message=="Success")
          {
              var responseToken= data.response;
              localStorage.setItem("_r",responseToken);
              localStorage.setItem("T",data.type);
              location.href=path+'associate/dashboard?status=login';
          }
      },
      "statusCode": {
          404: function(error) {
              console.log(error);
          },
          406: function (error) {
              console.log(error);
          }
      }
  });
}

// Associate Login
$("#associate-login-frm").submit(function(e){
    e.preventDefault();
    var err = 0;
    var request_data = {};
    request_data.url = path+'associate/signin/authenticate';
    request_data.data = {};
    request_data.data.email = $.trim($("#email").val());
    request_data.data.password = $.trim($("#password").val());
    request_data.data._token = $.cookie('_token_cookie');

    if(request_data.data.email.length>0 && /^\d+$/.test(request_data.data.email)){
      err += validateFormData(request_data.data.email, "#email", "Mobile No.");
    } else {
      err += validateFormData(request_data.data.email, "#email", "Email");
    }
    err += validateFormData(request_data.data.password, "#password", "Password");

    if(err == 0){
            form_btn_spinner_show($(this));
            process_get_request(request_data, function(json){
            $(".alert").remove();
            if(json.success){
                if(json.status == 200){
                    $.cookie('jwt', json.jwt);
                    loginMessengerAccount(json.email);
                }else {
                    form_btn_spinner_hide("#associate-login-frm", "<i class='zmdi zmdi-refresh zmdi-hc-fw'></i>");
                    $(".main-header").after("<div class='alert alert-danger alert-dismissible' role='alert'>"+json.msg+"</div>");
                }
            }else{
                form_btn_spinner_hide("#associate-login-frm", "<i class='zmdi zmdi-refresh zmdi-hc-fw'></i>");
                $(".main-header").after("<div class='alert alert-danger alert-dismissible' role='alert'>"+json.msg+"</div>");
            }
        });
    }
});

// Associate > project > get project list
var getaprolistcount=0;
function getProjects(){
  var request_data = {};
  request_data.data = {};
  request_data.url = path+'associate/project/get_projects';
  request_data.data.jwt = $.cookie('jwt');
  process_post_request(request_data, function(json){
      if(json.success){
          if(json.status == 200){
                var str='';
                $.each(json.list, function(key, val){
                    str += `<tr>
                              <td>
                                  { "pro_id": "${val.id}","pro_is_deleted": ${val.is_delete} ,"pro_title": "${val.project_title}",  "pro_desc": "${val.project_description}", "pro_img": "${val.logo}", "pro_created_on":"${val.created_at}","pro_start_date":"${val.start_date}","pro_mgr":"${val.project_manager}" }
                              </td>
                            </tr>`;
                });
                $('#a-pro_list-datatable-body').html(str);
                if(!getaprolistcount){
                  // Project Card
                  $("#a-pro_list-datatable").bootgrid({
                        css: {
                            icon: 'zmdi icon',
                            iconColumns: 'zmdi-view-module',
                            iconDown: 'zmdi-expand-more',
                            iconRefresh: 'zmdi-refresh',
                            iconUp: 'zmdi-expand-less'
                        },
                        formatters: {
                            "p_list": function(column, row) {
                                 var outp = '';
                                 str = JSON.parse(row.plist);
                                 outp = `<div class="card c-dark palette-Blue-Grey bg" style="margin-bottom: 0px !important;">
                                            <div class="card-header text-center" style="padding-bottom: 0px !important;">
                                                <h1 class="m-l-10 c-white f-20">${str.pro_title}</h1>
                                            </div>
                                            <div class="card-body card-padding">
                                                <div class="row">
                                                    <div class="col-md-2 text-center">`;
                                                        if(str.pro_img.length >= 33) {
                                                            outp += `<img src="/${str.pro_img}" style="border: 2px solid #fff; border-radius: 50%; width:125px;" class="z-depth-3 / z-depth(3)" alt="" />`;
                                                         } else {
                                                            if(str.pro_img.length > 4 && str.pro_img.length < 10){
                                                              str.pro_img = str.pro_img.substring(0,4)+'..';
                                                            } else {
                                                              str.pro_img = str.pro_img;
                                                            }
                                                            outp += `<div class="associate-project-list-no-img z-depth-3 / z-depth(3)"">${str.pro_img.toUpperCase()}</div>`;
                                                         }
                                                    outp += `</div>
                                                    <div class="col-md-7">
                                                        <h5 class="c-white text-justify">
                                                            ${str.pro_desc}
                                                        </h5>
                                                    </div>
                                                    <div class="col-md-3">
                                                        <button class="m-b-2 btn btn-block btn-default btn-icon-text waves-effect" onclick="manageMembers('${str.pro_id}','${str.pro_title}'); return false;"><i class="zmdi zmdi-accounts-alt"></i> Manage Members</button>
                                                        <button class="m-b-2 btn btn-block btn-default btn-icon-text waves-effect" onclick="manageProcesses('${str.pro_id}'); return false;"><i class="zmdi zmdi-layers"></i> Manage Processes</button>
                                                        <button class="btn btn-block btn-default btn-icon-text waves-effect" onclick="getProjectDependencies('${str.pro_id}'); return false;"><i class="zmdi zmdi-device-hub"></i> Project Dependency</button>
                                                        <button class="m-b-2 btn btn-block btn-default btn-icon-text waves-effect" onclick="editProject('${str.pro_id}'); return false;"><i class="zmdi zmdi-edit"></i> Edit Project</button>
                                                        <button class="btn btn-block btn-default btn-icon-text waves-effect" onclick="deleteProject('${str.pro_id}'); return false;"><i class="zmdi ${str.pro_is_deleted ? 'zmdi-refresh' : 'zmdi-delete'}"></i> ${str.pro_is_deleted ? 'Restore' : 'Delete'} Project</button>
                                                    </div>
                                                </div>
                                                <div class="m-t-5 row">
                                                   <div class="col-md-12 c-white">
                                                      <button class="btn palette-Teal bg btn-icon-text waves-effect" onclick="projectStatus('${str.pro_id}'); return false;"><i class="zmdi zmdi-trending-up"></i> Project Status</button>
                                                      <small class="m-l-10">Created On: ${str.pro_created_on}</small>
                                                      <small class="m-l-10">Start Date: ${str.pro_start_date}</small>
                                                      <small class="m-l-10">Project Manager: ${str.pro_mgr.toUpperCase()}</small>
                                                   </div>
                                                </div>
                                            </div>
                                        </div>`;
                                 return outp;
                            }
                        }
                  });
                } else {
                  $("#a-pro_list-datatable").bootgrid('destroy');
                  $('#a-pro_list-datatable-body').html(str);
                  $("#a-pro_list-datatable").bootgrid({
                        css: {
                            icon: 'zmdi icon',
                            iconColumns: 'zmdi-view-module',
                            iconDown: 'zmdi-expand-more',
                            iconRefresh: 'zmdi-refresh',
                            iconUp: 'zmdi-expand-less'
                        },
                        formatters: {
                            "p_list": function(column, row) {
                                 var outp = '';
                                 str = JSON.parse(row.plist);
                                 outp = `<div class="card c-dark palette-Blue-Grey bg" style="margin-bottom: 0px !important;">
                                            <div class="card-header text-center" style="padding-bottom: 0px !important;">
                                                <h1 class="m-l-10 c-white f-20">${str.pro_title}</h1>
                                            </div>
                                            <div class="card-body card-padding">
                                                <div class="row">
                                                    <div class="col-md-2 text-center">`;
                                                        if(str.pro_img.length >= 33) {
                                                            outp += `<img src="/${str.pro_img}" style="border: 2px solid #fff; border-radius: 50%; width:125px;" class="z-depth-3 / z-depth(3)" alt="" />`;
                                                         } else {
                                                            if(str.pro_img.length > 4 && str.pro_img.length < 10){
                                                              str.pro_img = str.pro_img.substring(0,4)+'..';
                                                            } else {
                                                              str.pro_img = str.pro_img;
                                                            }
                                                            outp += `<div class="associate-project-list-no-img z-depth-3 / z-depth(3)">${str.pro_img.toUpperCase()}</div>`;
                                                         }
                                                    outp += `</div>
                                                    <div class="col-md-7">
                                                        <h5 class="c-white text-justify">
                                                            ${str.pro_desc}
                                                        </h5>
                                                    </div>
                                                    <div class="col-md-3">
                                                        <button class="m-b-2 btn btn-block btn-default btn-icon-text waves-effect" onclick="manageMembers('${str.pro_id}','${str.pro_title}'); return false;"><i class="zmdi zmdi-accounts-alt"></i> Manage Members</button>
                                                        <button class="m-b-2 btn btn-block btn-default btn-icon-text waves-effect" onclick="manageProcesses('${str.pro_id}'); return false;"><i class="zmdi zmdi-layers"></i> Manage Processes</button>
                                                        <button class="btn btn-block btn-default btn-icon-text waves-effect" onclick="getProjectDependencies('${str.pro_id}'); return false;"><i class="zmdi zmdi-device-hub"></i> Project Dependency</button>
                                                        <button class="m-b-2 btn btn-block btn-default btn-icon-text waves-effect" onclick="editProject('${str.pro_id}'); return false;"><i class="zmdi zmdi-edit"></i> Edit Project</button>
                                                        <button class="btn btn-block btn-default btn-icon-text waves-effect" onclick="deleteProject('${str.pro_id}'); return false;"><i class="zmdi ${str.pro_is_deleted ? 'zmdi-refresh' : 'zmdi-delete'}"></i> ${str.pro_is_deleted ? 'Restore' : 'Delete'} Project</button>
                                                   </div>
                                                </div>
                                                <div class="m-t-5 row">
                                                   <div class="col-md-12 c-white">
                                                      <button class="btn palette-Teal bg btn-icon-text waves-effect" onclick="projectStatus('${str.pro_id}'); return false;"><i class="zmdi zmdi-trending-up"></i> Project Status</button>
                                                      <small class="m-l-10">Created On: ${str.pro_created_on}</small>
                                                      <small class="m-l-10">Start Date: ${str.pro_start_date}</small>
                                                      <small class="m-l-10">Project Manager: ${str.pro_mgr.toUpperCase()}</small>
                                                   </div>
                                                </div>
                                            </div>
                                        </div>`;
                                 return outp;
                            }
                        }
                  });
                }
          }else{
              if(!json.list){
                str += `<tr>
                        <td colspan="4" class="text-center">No Record Found!</td>
                        </tr>`;
              }
              $('#a-pro_list-datatable-body').html(str);
              createPopUpNotificaton(json.msg, 'danger');
          }
      }else{
           createPopUpNotificaton(json.msg, 'danger');
      }
      getaprolistcount++;
  });
}

// Associate > project > add project
$("#add-project-frm").submit(function(e){
    var err=0;
    e.preventDefault();
    err += validateFormData($.trim($("#p-a-title").val()), "#p-a-title", "Project title");
    err += validateFormData($.trim($("#p-a-desc").val()), "#p-a-desc", "Project description");
    err += validateFormData($.trim($("#p-a-associates").val()), "#p-a-associates-err", "Team member");
    err += validateFormData($.trim($("#p-a-start-date").val()), "#p-a-start-date", "Start date");
    var project_logo = $('#p-a-logo')[0].files[0];
    if(!err){
      var formData = new FormData();
      formData.append('project_logo', project_logo);
      formData.append('jwt', $.cookie("jwt"));
      formData.append('template', $("#p-a-template").val());
      formData.append('title', $.trim($("#p-a-title").val()));
      formData.append('desc', $.trim($("#p-a-desc").val()));
      formData.append('associate', $("#p-a-associates").val());
      formData.append('project_mgr', $("#p-a-pmanager").val());
      formData.append('project_creator', $("#p-a-pcreator").val());
      formData.append('start_date', $("#p-a-start-date").val());
      formData.append('completion_date', $.trim($("#p-a-completion-date").val()));
      $.ajax({
        url: path+'associate/project/create_project',
        method: "POST",
        data: formData,
        contentType: false,
        cache: false,
        processData: false,
        success: function(data){
          json = JSON.parse(data);
          if(json.status == 200){
              form_btn_spinner_hide("#add-project-frm", "Create");
              //create an group in messenger with same associates
              createMessengerGroup(json);
          } else {
              form_btn_spinner_hide("#add-project-frm", "Create");
              closeModelAndRest("#add-project-frm");
              createPopUpNotificaton(json.msg, 'danger');
          }
        },
        error: function(data){
          json = JSON.parse(data);
          form_btn_spinner_hide("#add-project-frm", "Create");
          closeModelAndRest("#add-project-frm");
          createPopUpNotificaton(json.msg, 'danger');
        }
      });
    }
});

// Associate > project > add project > create messeger group
function createMessengerGroup(data){
  var formData = new FormData();
  $.each(data.associate_list, function(key, val){
    formData.append('memberId[]', val);
  });
  formData.append('g_name', data.group_title);
  $.ajax({
      "url": path+"messenger/imApi/createGroupByMember/",
      "method": "POST",
      "headers": {
          "authorization": "Basic YWRtaW46MTIzNA==",
          "authorizationkeyfortoken": localStorage.getItem("_r"),
          "cache-control": "no-cache"
      },
      "processData": false,
      "contentType": false,
      "mimeType": "multipart/form-data",
      "data": formData,
      "success":function (response) {
          var json=JSON.parse(response);
          if(json.status.code==200 && json.status.message=="Success")
          {
              closeModelAndRest("#add-project-frm");
              createPopUpNotificaton(data.msg, 'success');
          }
      },
      "statusCode": {
          404: function(error) {
              console.log(error);
          },
          406: function (error) {
              console.log(error);
          }
      }
  });
}

// Associate > project > edit project
$("#edit-project-frm").submit(function(e){
    var err=0;
    e.preventDefault();
    err += validateFormData($.trim($("#e-p-a-title").val()), "#e-p-a-title", "Project title");
    err += validateFormData($.trim($("#e-p-a-desc").val()), "#e-p-a-desc", "Project description");
    err += validateFormData($.trim($("#e-p-a-start-date").val()), "#e-p-a-start-date", "Start date");
    var save_template = 0;
    if($("#e-p-a-save-template").is(":checked")){
       save_template = 1;
    }
    var project_logo = $('#e-p-a-logo')[0].files[0];
    if(!err){
      var formData = new FormData();
      formData.append('project_id', $("#pro-id").val());
      formData.append('project_logo', project_logo);
      formData.append('jwt', $.cookie("jwt"));
      formData.append('template', $("#e-p-a-template").val());
      formData.append('title', $.trim($("#e-p-a-title").val()));
      formData.append('desc', $.trim($("#e-p-a-desc").val()));
      formData.append('project_mgr', $("#e-p-a-pmanager").val());
      formData.append('start_date', $("#e-p-a-start-date").val());
      formData.append('completion_date', $.trim($("#e-p-a-completion-date").val()));
      formData.append('save_template', save_template);
      $.ajax({
        url: path+'associate/project/edit_project',
        method: "POST",
        data: formData,
        contentType: false,
        cache: false,
        processData: false,
        success: function(data){
          //console.log(data)
          json = JSON.parse(data);
          if(json.status == 200){
              form_btn_spinner_hide("#add-project-frm", "Create");
              closeModelAndRest("#add-project-frm");
              createPopUpNotificaton(json.msg, 'success');
              getProjects();
          } else {
              form_btn_spinner_hide("#add-project-frm", "Create");
              closeModelAndRest("#add-project-frm");
              createPopUpNotificaton(json.msg, 'danger');
          }
        },
        error: function(data){
          json = JSON.parse(data);
          form_btn_spinner_hide("#add-project-frm", "Create");
          closeModelAndRest("#add-project-frm");
          createPopUpNotificaton(json.msg, 'danger');
        }
      });
    }
});

// Associate > project > add/remove members
$("#update-project-members-frm").submit(function(e){
    var err=0;
    e.preventDefault();
    var request_data = {};
    request_data.data = {};
    request_data.url = path+'associate/project/update_pro_members';
    request_data.data.jwt = $.cookie('jwt');
    request_data.data.pro_id = $('#pro-id').val();
    request_data.data.pro_title = $('#pro-title').val();
    request_data.data.associates = $("#p-a-associates").val();
    err += validateFormData($.trim($("#p-a-associates").val()), "#p-a-associates-err", "Team member");
    if(!err){
        process_post_request(request_data, function(json){
          if(json.success){
              if(json.status == 200){
                // update the messenger group update the member list
                updateMessengerList(json);
              }else{
                if(json.field){
                    $(`#${json.field}`).parent().addClass("has-error");
                    $(`#${json.field}`).next().remove();
                    $(`#${json.field}`).after("<small class='text-danger err'>"+json.msg+"</small>");
                } else {
                  $(`#${json.field}`).parent().addClass("has-error");
                  $(`#${json.field}`).next().remove();
                  $(`#${json.field}`).after("<small class='text-danger err'>"+json.msg+"</small>");
                }
              }
          }else{
            $(`#${json.field}`).parent().addClass("has-error");
            $(`#${json.field}`).next().remove();
            $(`#${json.field}`).after("<small class='text-danger err'>"+json.msg+"</small>");
          }
        });
    }
});

// Associate > project > add/remove member > messenger
function updateMessengerList(json){
    // Update the group members
    function remMemFrmMsgGrp(memberId){
      var formData = new FormData();
      formData.append('memberId', memberId);
      formData.append('groupId', json.group_id);
      $.ajax({
          "url": path+"messenger/imApi/deleteMember",
          "method": "POST",
          "headers": {
              "authorization": "Basic YWRtaW46MTIzNA==",
              "authorizationkeyfortoken": localStorage.getItem("_r"),
              "cache-control": "no-cache"
          },
          "processData": false,
          "contentType": false,
          "mimeType": "multipart/form-data",
          "data": formData,
          "success":function (response) {
              var data=JSON.parse(response);
              if(data.status.code==200 && data.status.message=="Success")
              {
                  // closeModelAndRest("#manage-project-modal");
                  // createPopUpNotificaton(json.msg, 'success');
              }
          },
          "statusCode": {
              404: function(error) {
                  console.log(error);
              },
              406: function (error) {
                  console.log(error);
              }
          }
      });
    }

    function addMemToMsgGrp(memberId){
      var formData = new FormData();
      formData.append('memberId[]', memberId);
      formData.append('groupId', json.group_id);
      $.ajax({
          "url": path+"messenger/imApi/addGroupMember",
          "method": "POST",
          "headers": {
              "authorization": "Basic YWRtaW46MTIzNA==",
              "authorizationkeyfortoken": localStorage.getItem("_r"),
              "cache-control": "no-cache"
          },
          "processData": false,
          "contentType": false,
          "mimeType": "multipart/form-data",
          "data": formData,
          "success":function (response) {
              var data=JSON.parse(response);
              if(data.status.code==200 && data.status.message=="Success")
              {
                  console.log("yes")
              }
          },
          "statusCode": {
              404: function(error) {
                  console.log(error);
              },
              406: function (error) {
                  console.log(error);
              }
          }
      });
    }

    function renewMsgGrpMem(arr1,arr2){
        arr1=JSON.parse("[" + arr1.toString() + "]");
        arr2=JSON.parse("[" + arr2.toString() + "]");

        var addNewMembers = [];
        var removeOldMembers = [];

        for(var i=0;i<arr1.length; i++){
          if(arr2.indexOf(arr1[i])==-1){
            addMemToMsgGrp(arr1[i]);
          }
        }

        for(var j=0;j<arr2.length; j++){
          if(arr1.indexOf(arr2[j])==-1){
            remMemFrmMsgGrp(arr2[j]);
          }
        }

        closeModelAndRest("#manage-project-modal");
        createPopUpNotificaton(json.msg, 'success');
    }

    // Get messenger existing members
    var oldMembers = [];
    $.ajax({
        "url": path+"messenger/imApi/getMembers?groupId="+json.group_id,
        "method": "GET",
        "headers": {
            "authorization": "Basic YWRtaW46MTIzNA==",
            "authorizationkeyfortoken": localStorage.getItem("_r"),
            "cache-control": "no-cache"
        },
        "processData": false,
        "contentType": false,
        "success":function (response) {
            var data=response;
            if(data.status.code==200 && data.status.message=="Success")
            {
                if(data.response.memberList){
                  $.each(data.response.memberList, function(key, mmlval2){
                    oldMembers.push(mmlval2.userId);
                  });
                  renewMsgGrpMem(json.associates_messenger_list, oldMembers);
                }
            }
        },
        "statusCode": {
            404: function(error) {
                console.log(error);
            },
            406: function (error) {
                console.log(error);
            }
        }
    });
}

// Associate > project > add process
$("#add-project-process-frm").submit(function(e){
    var err=0;
    e.preventDefault();
    err += validateFormData($.trim($("#add-process-p-title").val()), "#add-process-p-title", "Process title");
    err += validateFormData($.trim($("#add-process-p-desc").val()), "#add-process-p-desc", "Process description");
    var request_data = {};
    request_data.data = {};
    request_data.url = path+'associate/project/add_project_process';
    request_data.data.pro_id = $('#pro-id').val();
    request_data.data.title = $.trim($("#add-process-p-title").val());
    request_data.data.desc = $.trim($("#add-process-p-desc").val());
    request_data.data.jwt = $.cookie('jwt');
    if(!err){
      form_btn_spinner_show($(this));
          process_post_request(request_data, function(json){
            if(json.success){
                if(json.status == 200){
                    form_btn_spinner_hide("#add-project-process-frm", "Add Process");
                    $("#add-process-p-title").val('');
                    $("#add-process-p-desc").val('');
                    getAllprocesses('manageProcesses');
                }else{
                    form_btn_spinner_hide("#add-project-process-frm", "Add Process");
                    closeModelAndRest("#add-project-process-frm");
                    createPopUpNotificaton(json.msg, 'danger');
                }
            }else{
                form_btn_spinner_hide("#add-project-process-frm", "Add Process");
                closeModelAndRest("#add-project-process-frm");
                createPopUpNotificaton(json.msg, 'danger');
            }
        });
    }
});

// Associate > project > edit process
$("#edit-project-process-frm").submit(function(e){
    var err=0;
    e.preventDefault();
    err += validateFormData($.trim($("#edit-process-p-title").val()), "#edit-process-p-title", "Process title");
    err += validateFormData($.trim($("#edit-process-p-desc").val()), "#edit-process-p-desc", "Process description");
    var request_data = {};
    request_data.data = {};
    request_data.url = path+'associate/project/edit_project_process';
    request_data.data.process_id = $('#edit-process-id').val();
    request_data.data.title = $.trim($("#edit-process-p-title").val());
    request_data.data.desc = $.trim($("#edit-process-p-desc").val());
    request_data.data.jwt = $.cookie('jwt');
    if(!err){
      form_btn_spinner_show($(this));
          process_post_request(request_data, function(json){
            if(json.success){
                if(json.status == 200){
                    form_btn_spinner_hide("#edit-project-process-frm", "Update Process");
                    $("#edit-process-p-title").val('');
                    $("#edit-process-p-desc").val('');
                    getAllprocesses('manageProcesses');
                }else{
                    form_btn_spinner_hide("#edit-project-process-frm", "Update Process");
                    closeModelAndRest("#edit-project-process-frm");
                    createPopUpNotificaton(json.msg, 'danger');
                }
            }else{
                form_btn_spinner_hide("#edit-project-process-frm", "Update Process");
                closeModelAndRest("#edit-project-process-frm");
                createPopUpNotificaton(json.msg, 'danger');
            }
        });
    }
});

// Associate > task > add associate group
$("#add-task-group-frm").submit(function(e){
    var err=0;
    e.preventDefault();
    err += validateFormData($.trim($("#t-a-grp-name").val()), "#t-a-grp-name", "Group Name");
    err += validateFormData($.trim($("#t-a-grp-associates").val()), "#t-a-grp-associates-err", "Group member list");
    var request_data = {};
    request_data.data = {};
    request_data.url = path+'associate/task/add_associate_group';
    request_data.data.g_name = $.trim($("#t-a-grp-name").val());
    request_data.data.g_members = $.trim($("#t-a-grp-associates").val());
    request_data.data.jwt = $.cookie('jwt');
    if(!err){
      form_btn_spinner_show($(this));
          process_post_request(request_data, function(json){
            if(json.success){
                if(json.status == 200){
                    form_btn_spinner_hide("#add-task-group-frm", "Create Group");
                    $("#t-a-grp-associates").val('');
                    $("#t-a-grp-associates").trigger("chosen:updated");
                    getUpdatedGroups();
                    closeModelAndRest("#add-task-group-frm");
                    createPopUpNotificaton(json.msg, 'success');
                }else{
                    form_btn_spinner_hide("#add-task-group-frm", "Create Group");
                    closeModelAndRest("#add-task-group-frm");
                    createPopUpNotificaton(json.msg, 'danger');
                }
            }else{
                form_btn_spinner_hide("#add-task-group-frm", "Create Group");
                closeModelAndRest("#add-task-group-frm");
                createPopUpNotificaton(json.msg, 'danger');
            }
        });
    }
});

// Associate > task > edit associate group
$("#edit-task-group-frm").submit(function(e){
    var err=0;
    e.preventDefault();
    err += validateFormData($.trim($("#t-e-grp-name").val()), "#t-e-grp-name", "Group Name");
    err += validateFormData($.trim($("#t-e-grp-associates").val()), "#t-e-grp-associates-err", "Group member list");
    var request_data = {};
    request_data.data = {};
    request_data.url = path+'associate/task/update_associate_group';
    request_data.data.g_id = $.trim($("#e-group-id").val());
    request_data.data.g_name = $.trim($("#t-e-grp-name").val());
    request_data.data.g_members = $.trim($("#t-e-grp-associates").val());
    request_data.data.jwt = $.cookie('jwt');
    if(!err){
      form_btn_spinner_show($(this));
          process_post_request(request_data, function(json){
            if(json.success){
                if(json.status == 200){
                    form_btn_spinner_hide("#edit-task-group-frm", "Update Group");
                    $("#t-e-grp-associates").val('');
                    $("#t-e-grp-associates").trigger("chosen:updated");
                    closeModelAndRest("#edit-task-group-frm");
                    createPopUpNotificaton(json.msg, 'success');
                    getUpdatedGroups();
                }else{
                    form_btn_spinner_hide("#edit-task-group-frm", "Update Group");
                    closeModelAndRest("#edit-task-group-frm");
                    createPopUpNotificaton(json.msg, 'danger');
                }
            }else{
                form_btn_spinner_hide("#edit-task-group-frm", "Update Group");
                closeModelAndRest("#edit-task-group-frm");
                createPopUpNotificaton(json.msg, 'danger');
            }
        });
    }
});

// Associate > task > add task
$("#add-task-frm").submit(function(e){
	
    var err=0;
    e.preventDefault();
    err += validateFormData($.trim($("#t-a-associates").val()), "#t-a-associates-err", "Associate");
    err += validateFormData($.trim($("#t-a-desc").val()), "#t-a-desc", "Task Description");
    err += validateFormData($.trim($("#t-a-title").val()), "#t-a-title", "Task Title");
    err += validateFormData($.trim($("#t-a-from-date").val()), "#t-a-from-date", "From Date");
    err += validateFormData($.trim($("#t-a-due-date").val()), "#t-a-due-date", "Due Date");
   // alert(validateFormData($.trim($("#t-a-due-date").val()), "#t-a-due-date", "Due Date"));
	var collaborative = 0;
    var critical = 0;
    var repeat_task = false;

    var attachments = $("#task_attachments")[0].files;

    var formData = new FormData();
    formData.append('jwt', $.cookie("jwt"));
    formData.append('associate', $("#t-a-associates").val());
    formData.append('description', $.trim($("#t-a-desc").val()));
    for(var x=0; x<attachments.length; x++){
      formData.append('attachments[]', attachments[x]);
    }
    if($('#t-a-process').val()!=undefined && $('#t-a-process').val().length>0){
      formData.append('process_id', $('#t-a-process').val());
    } else {
      formData.append('process_id', 0);
    }
    if($('#t-a-priority').val()!=null){
      formData.append('task_priority', $('#t-a-priority').val());
    } else {
      formData.append('task_priority', 0);
    }
	//alert($('#t-a-from-date').val());
    formData.append('task_title', $.trim($('#t-a-title').val()));
    formData.append('task_parent_id', $("#task-parent-id").val());
    formData.append('project', $("#t-a-project").val());
    formData.append('department', $('#t-a-department').val());
	formData.append('from_date', $('#t-a-from-date').val());
	formData.append('due_date', $('#t-a-due-date').val());
    formData.append('group', $('#t-a-group').val());
    formData.append('task_type', $('input[name=t_a_task_type]:checked').val());

    if($("#t-a-collaborative-task").is(":checked")){
      collaborative=1;
    }

    if($("#t-a-emergency-task").is(":checked")){
      critical=1;
      formData.append('critical_type', $("#critical_type").val());
    }

    if($("#t-a-repeat-task").is(":checked")){
        repeat_task = true;
        formData.append('repeat', 1);
        formData.append('frequencey', $("#frequency").val());
        formData.append('yearly_month', $("#yearly_month").val());
        formData.append('yearly_day', $("#yearly_day").val());
        formData.append('monthly_day', $("#monthly_day").val());
        formData.append('weekly_day', $("#weekly_day").val());
    }

    if(!$("#t-a-repeat-task").is(":checked")){
        formData.append('from_date', $.trim($("#t-a-from-date").val()));
        formData.append('due_date', $.trim($("#t-a-due-date").val()));

        var selectedfrom = new Date($.trim($("#t-a-from-date").val()));
        selectedfrom.setHours(0,0,0,0);
        var now = new Date();
        now.setHours(0,0,0,0);
        if(selectedfrom < now){
            $("#t-a-from-date").parent().addClass("has-error");
            $("#t-a-from-date").next().remove();
            $("#t-a-from-date").after("<small class='text-danger'>Invalid date selected.</small>");
            err++;
        }else{
            $("#t-a-from-date").parent().removeClass("has-error");
            $("#t-a-from-date").next().remove();
        }

        var selecteddue = new Date($.trim($("#t-a-due-date").val()));
        selecteddue.setHours(0,0,0,0);
        if(selecteddue < now){
            $("#t-a-due-date").parent().addClass("has-error");
            $("#t-a-due-date").next().remove();
            $("#t-a-due-date").after("<small class='text-danger'>Invalid date selected.</small>");
            err++;
        }else if(selecteddue < selectedfrom){
            $("#t-a-due-date").parent().addClass("has-error");
            $("#t-a-due-date").next().remove();
            $("#t-a-due-date").after("<small class='text-danger'>Invalid date selected.</small>");
            err++;
        }else{
            $("#t-a-due-date").parent().removeClass("has-error");
            $("#t-a-due-date").next().remove();
        }
    }

    formData.append('collaborative', collaborative);
    formData.append('critical', critical);
    // formData.forEach((value,key) => {
    //       console.log(key+" "+value)
    // });
	
    if(err == 0 || repeat_task==true && err==2){
        form_btn_spinner_show("#add-task-frm");
        $.ajax({
          url: path+'associate/task/create_task',
          method: "POST",
          data: formData,
          contentType: false,
          cache: false,
          processData: false,
          success: function(data){
			 
            //console.log(data)
            json = JSON.parse(data);
            if(json.status == 200){
                form_btn_spinner_hide("#add-task-frm", "Create");
                closeModelAndRest("#add-task-frm");
                $('#secRowat').html('');
                $('#t-a-project, #t-a-department, #t-a-group').val(0);
                $('#t-a-department, #t-a-group, #t-a-project').trigger("chosen:updated");
                createPopUpNotificaton(json.msg, 'success');
            }else{
                form_btn_spinner_hide("#add-task-frm", "Create");
                closeModelAndRest("#add-task-frm");
                createPopUpNotificaton(json.msg, 'danger');
            }
          },
          error: function(data){
			 
            console.log(data)
            json = JSON.parse(data);
            form_btn_spinner_hide("#add-task-frm", "Create");
            closeModelAndRest("#add-task-frm");
            createPopUpNotificaton(json.msg, 'danger');
          }
        });
    }

});




// Associate > task > get task list
var getatasklistcount=0;
function getTask(filter_val=[],filter_typ=null){
    var request_data = {};
    request_data.data = {};
    request_data.url = path+'associate/task/get_task';
    if(filter_typ=='project'){
      $.each(filter_val, function(key, val){
        if(val.filter=='project_val'){
          request_data.data.project_id = val.value;
        }
        if(val.filter=='tstatus_val'){
          request_data.data.task_status = val.value;
        }
        if(val.filter=='taskType_val'){
          request_data.data.task_type = val.value;
        }
      });
    } else if(filter_typ=='department'){
      $.each(filter_val, function(key, val){
        if(val.filter=='department_val'){
          request_data.data.department_id = val.value;
        }
        if(val.filter=='tstatus_val'){
          request_data.data.task_status = val.value;
        }
        if(val.filter=='taskType_val'){
          request_data.data.task_type = val.value;
        }
      });
    } else if(filter_typ=='group') {
      $.each(filter_val, function(key, val){
        if(val.filter=='group_val'){
          request_data.data.associate_group_id = val.value;
        }
        if(val.filter=='tstatus_val'){
          request_data.data.task_status = val.value;
        }
        if(val.filter=='taskType_val'){
          request_data.data.task_type = val.value;
        }
      });
    }
    if(filter_typ=='task_status'){
      $.each(filter_val, function(key, val){
        if(val.filter=='tstatus_val'){
          request_data.data.task_status = val.value;
        }
        if(val.filter=='taskType_val'){
          request_data.data.task_type = val.value;
        }
        if(val.filter=='project_val'){
          request_data.data.project_id = val.value;
        } else if(val.filter=='department_val'){
          request_data.data.department_id = val.value;
        } else if(val.filter=='group_val'){
          request_data.data.associate_group_id = val.value;
        }
      });
    }
    if(filter_typ=='task_type'){
      $.each(filter_val, function(key, val){
        if(val.filter=='taskType_val'){
          request_data.data.task_type = val.value;
        }
        if(val.filter=='tstatus_val'){
          request_data.data.task_status = val.value;
        }
        if(val.filter=='project_val'){
          request_data.data.project_id = val.value;
        } else if(val.filter=='department_val'){
          request_data.data.department_id = val.value;
        } else if(val.filter=='group_val'){
          request_data.data.associate_group_id = val.value;
        }
      });
    }
    request_data.data.jwt = $.cookie('jwt');
    process_post_request(request_data, function(json){
        if(json.success){
            if(json.status == 200){
                  var str='';
                  $.each(json.list, function(key, val){
                      str += `<tr>
                            <td>
                                { "task_id": "${val.id}", "task_desc": "${val.description}", "task_title": "${val.title.trim()}", "created_at": "${val.created_at}", "start_date": "${val.start_date}", "due_date": "${val.due_date}", "creator": "${val.creator[0].name}", "creator_id": "${val.creator[0].id}", "assignee": "${val.assignee[0].name}", "assignee_id": "${val.assignee[0].id}", "progress": "${val.progress}", "is_completed": "${val.is_complete}", "is_collaborative": "${val.is_collaborative}", "project_id": "${val.project_id}", "is_recurrsive": "${val.is_recurrsive}", "repeat_type": "${val.repeat_type}", "repeat_schedule": "${val.repeat_schedule}", "department_id": ${val.department}, "associate_group": "${val.associate_group}", "task_type": "${val.task_type}", "is_critical": "${val.is_critical}", "redo_task": ${val.redo_task}, "exception_raised": ${val.exception_raised}, "parent_id" : ${val.parent_id}, "is_parent" : ${val.is_parent}}
                            </td>
                          </tr>`;
                  });
                  $('#a-task_list-datatable-body').html(str);
                  if(!getatasklistcount){
                    // Task Card
                    $("#a-task_list-datatable").bootgrid({
                          css: {
                              icon: 'zmdi icon',
                              iconColumns: 'zmdi-view-module',
                              iconDown: 'zmdi-expand-more',
                              iconRefresh: 'zmdi-refresh',
                              iconUp: 'zmdi-expand-less'
                          },
                          formatters: {
                              "t_list": function(column, row) {
                                  var outp = '';
                                  var pgrs='';
                                  var cardClr='';
                                  var task_type='';
                                  var over_due=0;
                                  str = JSON.parse(row.tlist);
                                  if(str.is_completed==1){
                                    pgrs = 'completed';
                                    cardClr='Green';
                                  } else if (str.progress==1){
                                    pgrs = 'in progress';
                                    cardClr='Yellow';
                                  } else {
                                    pgrs = 'not attended';
                                    cardClr='Red';
                                  }
                                  var myDate = new Date(str.due_date);
                                  var today = new Date();
                                  if ( myDate < today ) {
                                    over_due = 'OVERDUE';
                                  }
                                  task_type = str.task_type.length>0 && str.task_type!='NULL' ? str.task_type : '';
                                  is_critical = str.is_critical>0 && str.is_critical!='NULL' ? '-<strong class="c-red"> CRITICAL</strong>' : '';
                                   outp = `<div class="card c-dark palette-${cardClr}-300 bg" style="margin-bottom: 0px !important;">
                                              <div class="card-header text-center" style="padding-bottom: 0px !important;">
                                                  <h1 class="m-l-10 c-white f-20"></h1>
                                              </div>
                                              <div class="card-body card-padding">
                                                  <div class="row">
                                                      <div class="col-md-9">
                                                          <p class="c-black text-justify f-14">`;
                                                           if(str.creator_id==str.assignee_id){
                                                              outp +=`<strong>Self Assigned [${task_type}] ${is_critical} ${ over_due!=0 ? `[${over_due}]` : ''} ${ str.redo_task==1 ? '[ReDo]' : '' }</strong>`;
                                                           } else {
                                                              outp +=`Assigned by <strong>${str.creator} [${task_type}] ${is_critical} ${ over_due!=0 ? `[${over_due}]` : ''} ${ str.redo_task==1 ? '[ReDo]' : '' }</strong>`;
                                                           }
                                                           if(str.parent_id>0){
                                                              outp +=`<strong>[Subtask]</strong>`;
                                                           }
                                                           if(str.is_parent==1){
                                                              outp +=`<strong>[Parenttask]</strong>`;
                                                           }
                                                           outp +=`<span class="pull-right">`;
                                                           if(str.is_collaborative>0){
                                                            outp +=` <i class="zmdi zmdi-tag zmdi-hc-fw"></i><span> Collaborative</span>`;
                                                           }
                                                           if(str.is_recurrsive>0){
                                                            outp +=` <i class="zmdi zmdi-tag zmdi-hc-fw"></i><span> Recurrsive</span>`;
                                                           }
                                                           if(str.project_id>0){
                                                             outp +=` <i class="zmdi zmdi-tag zmdi-hc-fw"></i><span> Project Task</span>`;
                                                           } else if(str.department_id>0) {
                                                             outp +=` <i class="zmdi zmdi-tag zmdi-hc-fw"></i><span> Department Task</span>`;
                                                           } else if(str.associate_group>0) {
                                                              outp +=` <i class="zmdi zmdi-tag zmdi-hc-fw"></i><span> Group Task</span>`;
                                                           }
                                                           outp +=`</span>`;
                                                          outp +=`</p>
                                                          <p class="c-black text-justify f-15">
                                                              ${str.task_title}
                                                          </p>
                                                          <p class="c-black text-justify">
                                                              ${str.task_desc}
                                                          </p>
                                                      </div>
                                                      <div class="col-md-3">
                                                          <button class="m-b-2 btn btn-block btn-default btn-icon-text waves-effect" onclick="taskComments('${str.task_id}'); return false;"><i class="zmdi zmdi-comment-alt-text"></i> View Comments</button>
                                                          <button class="m-b-2 btn btn-block btn-default btn-icon-text waves-effect" onclick="taskStatusUpdate('${str.task_id}','${str.progress}','${str.is_completed}'); return false;"><i class="zmdi zmdi-swap"></i> Change status</button>
                                                          <button class="m-b-2 btn btn-block btn-default btn-icon-text waves-effect" onclick="taskRedoTask('${str.task_id}'); return false;"><i class="zmdi zmdi-refresh"></i> Redo Task</button>
                                                          <button class="m-b-2 btn btn-block btn-default btn-icon-text waves-effect" onclick="taskExceptionRaised('${str.task_id}'); return false;"><i class="zmdi zmdi-pin-help"></i> ${str.exception_raised==0 ? 'Raise Exception' : 'Exception Raised'}</button>
                                                          <button class="m-b-2 btn btn-block btn-default btn-icon-text waves-effect" onclick="taskSubtask('${str.task_id}'); return false;"><i class="zmdi zmdi-pin-help"></i> Add Subtask</button>`;
                                                          if(str.creator_id==str.assignee_id){
                                                             outp +=`<button class="m-b-2 btn btn-block btn-default btn-icon-text waves-effect" onclick="taskDelete('${str.task_id}'); return false;"><i class="zmdi zmdi-delete"></i> Delete Task</button>`;
                                                          }
                                                      outp +=`</div>
                                                  </div>
                                                  <div class="m-t-5 row">
                                                    <div class="col-md-12 c-black">
                                                        <button class="btn palette-Teal bg btn-icon-text waves-effect" onclick="taskMoreInfo('${str.task_id}'); return false;"><i class="zmdi zmdi-more-vert"></i> More</button>
                                                        <small class="m-l-10">Created On:<strong class="f-14"> ${str.created_at} </strong></small>`
                                                        if(str.start_date!='null'){
                                                          outp +=`<small class="m-l-10">Start Date:<strong class="f-14"> ${str.start_date}</strong></small>`;
                                                        }
                                                        if(str.due_date!='null'){
                                                          outp +=`<small class="m-l-10">Due Date:<strong class="f-14"> ${str.due_date}</strong></small>`;
                                                        }
                                                        if(str.is_recurrsive>0){
                                                          outp +=`<small class="m-l-10">Repeat Type:<strong class="f-14">`;
                                                            if(str.repeat_type=='W'){
                                                              outp +=` Week `;
                                                            } else if(str.repeat_type=='M'){
                                                              outp +=` Month `;
                                                            }else{
                                                              outp +=` Year `;
                                                            }
                                                           outp +=`</strong></small><small class="m-l-10"> Repeat Schedule:<strong class="f-14"> ${str.repeat_schedule}</strong></small>`;
                                                         }
                                                     `</div>
                                                    </div>
                                              </div>
                                          </div>`;
                                          outp +=`<br/><br/><button class="btn btn-block btn-lg btn-default btn-icon-text waves-effect" onclick="taskDetailsPage('${str.task_id}'); return false;"> Task Details</button>`;
                                   return outp;
                              }
                          }
                    });
                  } else {
                    $("#a-task_list-datatable").bootgrid('destroy');
                    $('#a-task_list-datatable-body').html(str);
                    $("#a-task_list-datatable").bootgrid({
                          css: {
                              icon: 'zmdi icon',
                              iconColumns: 'zmdi-view-module',
                              iconDown: 'zmdi-expand-more',
                              iconRefresh: 'zmdi-refresh',
                              iconUp: 'zmdi-expand-less'
                          },
                          formatters: {
                              "t_list": function(column, row) {
                                  var outp = '';
                                  var pgrs='';
                                  var cardClr='';
                                  var task_type='';
                                  var over_due=0;
                                  str = JSON.parse(row.tlist);
                                  if(str.is_completed==1){
                                    pgrs = 'completed';
                                    cardClr='Green';
                                  } else if (str.progress==1){
                                    pgrs = 'in progress';
                                    cardClr='Yellow';
                                  } else{
                                    pgrs = 'not attended';
                                    cardClr='Red';
                                  }
                                  var myDate = new Date(str.due_date);
                                  var today = new Date();
                                  if ( myDate < today ) {
                                    over_due = 'OVERDUE';
                                  }
                                  task_type = str.task_type.length>0 && str.task_type!='NULL' ? str.task_type : false;
                                   outp = `<div class="card c-dark palette-${cardClr}-300 bg" style="margin-bottom: 0px !important;">
                                              <div class="card-header text-center" style="padding-bottom: 0px !important;">
                                                  <h1 class="m-l-10 c-white f-20"></h1>
                                              </div>
                                              <div class="card-body card-padding">
                                                  <div class="row">
                                                      <div class="col-md-9">
                                                          <p class="c-black text-justify f-14">`;
                                                           if(str.creator_id==str.assignee_id){
                                                              outp +=`<strong>Self Assigned [${task_type}] ${ over_due!=0 ? `[${over_due}]` : ''} ${ str.redo_task==1 ? '[ReDo]' : '' }</strong>`;
                                                           } else {
                                                              outp +=`Assigned by <strong>${str.creator} [${task_type}] ${ over_due!=0 ? `[${over_due}]` : ''} ${ str.redo_task==1 ? '[ReDo]' : '' }</strong>`;
                                                           }
                                                           if(str.parent_id>0){
                                                              outp +=`<strong>[Subtask]</strong>`;
                                                           }
                                                           if(str.is_parent==1){
                                                              outp +=`<strong>[Parenttask]</strong>`;
                                                           }
                                                           outp +=`<span class="pull-right">`;
                                                           if(str.is_collaborative>0){
                                                            outp +=` <i class="zmdi zmdi-tag zmdi-hc-fw"></i><span> Collaborative</span>`;
                                                           }
                                                           if(str.is_recurrsive>0){
                                                            outp +=` <i class="zmdi zmdi-tag zmdi-hc-fw"></i><span> Recurrsive</span>`;
                                                           }
                                                           if(str.project_id>0){
                                                             outp +=` <i class="zmdi zmdi-tag zmdi-hc-fw"></i><span> Project Task</span>`;
                                                           } else if(str.department_id>0) {
                                                             outp +=` <i class="zmdi zmdi-tag zmdi-hc-fw"></i><span> Department Task</span>`;
                                                           } else if(str.associate_group>0) {
                                                              outp +=` <i class="zmdi zmdi-tag zmdi-hc-fw"></i><span> Group Task</span>`;
                                                           }
                                                           outp +=`</span>`;
                                                          outp +=`</p>
                                                          <p class="c-black text-justify f-15">
                                                              ${str.task_title}
                                                          </p>
                                                          <p class="c-black text-justify">
                                                              ${str.task_desc}
                                                          </p>
                                                      </div>
                                                      <div class="col-md-3">
                                                          <button class="m-b-2 btn btn-block btn-default btn-icon-text waves-effect" onclick="taskComments('${str.task_id}'); return false;"><i class="zmdi zmdi-comment-alt-text"></i> View Comments</button>
                                                         <button class="m-b-2 btn btn-block btn-default btn-icon-text waves-effect" onclick="taskStatusUpdate('${str.task_id}','${str.progress}','${str.is_completed}'); return false;"><i class="zmdi zmdi-swap"></i> Change status</button>
                                                          <button class="m-b-2 btn btn-block btn-default btn-icon-text waves-effect" onclick="taskRedoTask('${str.task_id}'); return false;"><i class="zmdi zmdi-refresh"></i> Redo Task</button>
                                                          <button class="m-b-2 btn btn-block btn-default btn-icon-text waves-effect" onclick="taskExceptionRaised('${str.task_id}'); return false;"><i class="zmdi zmdi-pin-help"></i> ${str.exception_raised==0 ? 'Raise Exception' : 'Exception Raised'}</button>
                                                          <button class="m-b-2 btn btn-block btn-default btn-icon-text waves-effect" onclick="taskSubtask('${str.task_id}'); return false;"><i class="zmdi zmdi-pin-help"></i> Add Subtask</button>`;
                                                          if(str.creator_id==str.assignee_id){
                                                             outp +=`<button class="m-b-2 btn btn-block btn-default btn-icon-text waves-effect" onclick="taskDelete('${str.task_id}'); return false;"><i class="zmdi zmdi-delete"></i> Delete Task</button>`;
                                                          }
                                                      outp +=`</div>
                                                  </div>
                                                  <div class="m-t-5 row">
                                                     <div class="col-md-12 c-black">
                                                        <button class="btn palette-Teal bg btn-icon-text waves-effect" onclick="taskMoreInfo('${str.task_id}'); return false;"><i class="zmdi zmdi-more-vert"></i> More</button>
                                                        <small class="m-l-10">Created On:<strong class="f-14"> ${str.created_at} </strong></small>`
                                                        if(str.start_date!='null'){
                                                          outp +=`<small class="m-l-10">Start Date:<strong class="f-14"> ${str.start_date}</strong></small>`;
                                                        }
                                                        if(str.due_date!='null'){
                                                          outp +=`<small class="m-l-10">Due Date:<strong class="f-14"> ${str.due_date}</strong></small>`;
                                                        }
                                                        if(str.is_recurrsive>0){
                                                          outp +=`<small class="m-l-10">Repeat Type:<strong class="f-14">`;
                                                            if(str.repeat_type=='W'){
                                                              outp +=` Week `;
                                                            } else if(str.repeat_type=='M'){
                                                              outp +=` Month `;
                                                            }else{
                                                              outp +=` Year `;
                                                            }
                                                           outp +=`</strong></small><small class="m-l-10"> Repeat Schedule:<strong class="f-14"> ${str.repeat_schedule}</strong></small>`;
                                                         }
                                                     `</div>
                                                  </div>
                                              </div>
                                          </div>`;
                                          outp +=`<br/><br/><button class="btn btn-block btn-lg btn-default btn-icon-text waves-effect" onclick="taskDetailsPage('${str.task_id}'); return false;"> Task Details</button>`;
                                   return outp;
                              }
                          }
                    });
                  }
            }else{
                if(!json.list){
                  str += `<tr>
                          <td colspan="4" class="text-center">No Record Found!</td>
                          </tr>`;
                }
                $('#a-task_list-datatable-body').html(str);
                createPopUpNotificaton(json.msg, 'danger');
            }
        }else{
             createPopUpNotificaton(json.msg, 'danger');
        }
        getatasklistcount++;
    });
}

// Associate > task > get assigned task list

var getaassignedtasklistcount=0;
function getAssignedTask(filter_val=[],filter_typ=null){
    var request_data = {};
    request_data.data = {};
    request_data.url = path+'associate/task/get_assigned_task';
    if(filter_typ=='project'){
      $.each(filter_val, function(key, val){
        if(val.filter=='project_val'){
          request_data.data.project_id = val.value;
        }
        if(val.filter=='tstatus_val'){
          request_data.data.task_status = val.value;
        }
        if(val.filter=='taskType_val'){
          request_data.data.task_type = val.value;
        }
      });
    } else if(filter_typ=='department'){
      $.each(filter_val, function(key, val){
        if(val.filter=='department_val'){
          request_data.data.department_id = val.value;
        }
        if(val.filter=='tstatus_val'){
          request_data.data.task_status = val.value;
        }
        if(val.filter=='taskType_val'){
          request_data.data.task_type = val.value;
        }
      });
    } else if(filter_typ=='group') {
      $.each(filter_val, function(key, val){
        if(val.filter=='group_val'){
          request_data.data.associate_group_id = val.value;
        }
        if(val.filter=='tstatus_val'){
          request_data.data.task_status = val.value;
        }
        if(val.filter=='taskType_val'){
          request_data.data.task_type = val.value;
        }
      });
    }
    if(filter_typ=='task_status'){
      $.each(filter_val, function(key, val){
        if(val.filter=='tstatus_val'){
          request_data.data.task_status = val.value;
        }
        if(val.filter=='taskType_val'){
          request_data.data.task_type = val.value;
        }
        if(val.filter=='project_val'){
          request_data.data.project_id = val.value;
        } else if(val.filter=='department_val'){
          request_data.data.department_id = val.value;
        } else if(val.filter=='group_val'){
          request_data.data.associate_group_id = val.value;
        }
      });
    }
    if(filter_typ=='task_type'){
      $.each(filter_val, function(key, val){
        if(val.filter=='taskType_val'){
          request_data.data.task_type = val.value;
        }
        if(val.filter=='tstatus_val'){
          request_data.data.task_status = val.value;
        }
        if(val.filter=='project_val'){
          request_data.data.project_id = val.value;
        } else if(val.filter=='department_val'){
          request_data.data.department_id = val.value;
        } else if(val.filter=='group_val'){
          request_data.data.associate_group_id = val.value;
        }
      });
    }
    request_data.data.jwt = $.cookie('jwt');
    process_post_request(request_data, function(json){
        if(json.success){
            if(json.status == 200){
                  var str='';
                  $.each(json.list, function(key, val){
                      if(val.is_collaborative!='0'){
                        $.each(val.assignee, function(key, val2){
                          if(val.me!=val2[0].id){
                            str += `<tr>
                                  <td>
                                      { "task_id": "${val.id}", "task_title": "${val.title}", "task_desc": "${val.description}", "created_at": "${val.created_at}", "start_date": "${val.start_date}", "due_date": "${val.due_date}", "creator": "${val.creator[0].name}", "creator_id": "${val.creator[0].id}", "assignee": "${val2[0].name}", "assignee_id": "${val2[0].id}", "progress": "${val.progress}", "is_completed": "${val.is_complete}", "is_collaborative": "${val.is_collaborative}", "project_id": "${val.project_id}", "is_recurrsive": "${val.is_recurrsive}", "repeat_type": "${val.repeat_type}", "repeat_schedule": "${val.repeat_schedule}", "department_id": "${val.department}", "associate_group": "${val.associate_group}", "task_type": "${val.task_type}", "is_critical": "${val.is_critical}", "redo_task": "${val.redo_task}", "exception_raised": "${val.exception_raised}", "parent_id": "${val.parent_id}", "is_parent" : "${val.is_parent}"}
                                  </td>
                                </tr>`;
                          }
                        });
                      } else {
                        str += `<tr>
                              <td>
                                  { "task_id": "${val.id}", "task_title": "${val.title}", "task_desc": "${val.description}", "created_at": "${val.created_at}", "start_date": "${val.start_date}", "due_date": "${val.due_date}", "creator": "${val.creator[0].name}", "creator_id": "${val.creator[0].id}", "assignee": "${val.assignee[0].name}", "assignee_id": "${val.assignee[0].id}", "progress": "${val.progress}", "is_completed": "${val.is_complete}", "is_collaborative": "${val.is_collaborative}", "project_id": "${val.project_id}", "is_recurrsive": "${val.is_recurrsive}", "repeat_type": "${val.repeat_type}", "repeat_schedule": "${val.repeat_schedule}", "department_id": "${val.department}", "associate_group": "${val.associate_group}", "task_type": "${val.task_type}", "is_critical": "${val.is_critical}", "redo_task": "${val.redo_task}", "exception_raised": "${val.exception_raised}", "parent_id": "${val.parent_id}", "is_parent" : "${val.is_parent}"}
                              </td>
                            </tr>`;
                      }
                  });
				 // alert(str);
                  $('#a-task_assigned_list-datatable-body').html(str);
				  
                  if(!getaassignedtasklistcount){
                    // Task Card
                    $("#a-task_assigned_list-datatable").bootgrid({
                          css: {
                              icon: 'zmdi icon',
                              iconColumns: 'zmdi-view-module',
                              iconDown: 'zmdi-expand-more',
                              iconRefresh: 'zmdi-refresh',
                              iconUp: 'zmdi-expand-less'
                          },
                          formatters: {
                              "t_list": function(column, row) {

                                  var outp = '';
                                  var pgrs='';
                                  var cardClr='';
                                  var task_type='';
                                  var over_due=0;
                                  str = JSON.parse(row.tlist);
                                  if(str.is_completed==1){
                                    pgrs = 'completed';
                                    cardClr='Green';
                                  } else if (str.progress==1){
                                    pgrs = 'in progress';
                                    cardClr='Yellow';
                                  } else {
                                    pgrs = 'not attended';
                                    cardClr='Red';
                                  }
                                  var myDate = new Date(str.due_date);
                                  var today = new Date();
                                  if ( myDate < today ) {
                                    over_due = 'OVERDUE';
                                  }
                                  task_type = str.task_type.length>0 && str.task_type!='NULL' ? str.task_type : '';
                                  is_critical = str.is_critical>0 && str.is_critical!='NULL' ? '-<strong class="c-red"> CRITICAL</strong>' : '';
                                   outp = `<div class="card c-dark palette-${cardClr}-300 bg" style="margin-bottom: 0px !important;">
                                              <div class="card-header text-center" style="padding-bottom: 0px !important;">
                                                  <h1 class="m-l-10 c-white f-20"></h1>
                                              </div>
                                              <div class="card-body card-padding">
                                                  <div class="row">
                                                      <div class="col-md-9">
                                                          <p class="c-black text-justify f-14">`;
                                                           if(str.creator_id!=str.assignee_id){
                                                              outp +=`Assigned to <strong>${str.assignee} [${task_type}] ${is_critical} ${ over_due!=0 ? `[${over_due}]` : ''} ${ str.redo_task==1 ? '[ReDo]' : '' }</strong>`;
                                                           }
                                                           if(str.parent_id>0){
                                                              outp +=`<strong>[Subtask]</strong>`;
                                                           }
                                                           if(str.is_parent==1){
                                                              outp +=`<strong>[Parenttask]</strong>`;
                                                           }
                                                           outp +=`<span class="pull-right">`;
                                                           if(str.is_collaborative>0){
                                                            outp +=` <i class="zmdi zmdi-tag zmdi-hc-fw"></i><span> Collaborative</span>`;
                                                           }
                                                           if(str.is_recurrsive>0){
                                                            outp +=` <i class="zmdi zmdi-tag zmdi-hc-fw"></i><span> Recurrsive</span>`;
                                                           }
                                                           if(str.project_id>0){
                                                             outp +=` <i class="zmdi zmdi-tag zmdi-hc-fw"></i><span> Project Task</span>`;
                                                           } else if(str.department_id>0) {
                                                             outp +=` <i class="zmdi zmdi-tag zmdi-hc-fw"></i><span> Department Task</span>`;
                                                           } else if(str.associate_group>0) {
                                                              outp +=` <i class="zmdi zmdi-tag zmdi-hc-fw"></i><span> Group Task</span>`;
                                                           }
                                                           outp +=`</span>`;
                                                          outp +=`</p>
                                                          <p class="c-black text-justify f-15">
                                                              ${str.task_title}
                                                          </p>
                                                          <p class="c-black text-justify">
                                                              ${str.task_desc}
                                                          </p>
                                                      </div>
                                                      <div class="col-md-3">
                                                          <button class="m-b-2 btn btn-block btn-default btn-icon-text waves-effect" onclick="taskComments('${str.task_id}'); return false;"><i class="zmdi zmdi-comment-alt-text"></i> View Comments</button>
                                                         <!-- <button class="m-b-2 btn btn-block btn-default btn-icon-text waves-effect" onclick="taskStatusUpdate('${str.task_id}'); return false;"><i class="zmdi zmdi-swap"></i> Change status</button> -->
                                                          <button class="m-b-2 btn btn-block btn-default btn-icon-text waves-effect" onclick="taskRedoTask('${str.task_id}'); return false;"><i class="zmdi zmdi-refresh"></i> Redo Task</button>
                                                          <button class="m-b-2 btn btn-block btn-default btn-icon-text waves-effect" onclick="taskExceptionRaised('${str.task_id}'); return false;"><i class="zmdi zmdi-pin-help"></i> ${str.exception_raised==0 ? 'Raise Exception' : 'Exception Raised'}</button>
                                                          <button class="m-b-2 btn btn-block btn-default btn-icon-text waves-effect" onclick="taskDelete('${str.task_id}'); return false;"><i class="zmdi zmdi-delete"></i> Delete Task</button>`;
                                                          //<button class="m-b-2 btn btn-block btn-default btn-icon-text waves-effect" onclick="taskEdit(${str.task_id}); return false;"><i class="zmdi zmdi-edit"></i> Edit Task</button>
                                                          outp += `<button class="m-b-2 btn btn-block btn-default btn-icon-text waves-effect" onclick="taskSubtask('${str.task_id}'); return false;"><i class="zmdi zmdi-pin-help"></i> Add Subtask</button>
                                                      </div>
                                                  </div>
                                                  <div class="m-t-5 row">
                                                     <div class="col-md-12 c-black">
                                                        <button class="btn palette-Teal bg btn-icon-text waves-effect" onclick="ataskMoreInfo('${str.task_id}'); return false;"><i class="zmdi zmdi-more-vert"></i> More</button>
                                                        <small class="m-l-10">Created On:<strong class="f-14"> ${str.created_at} </strong></small>`
                                                        if(str.start_date!='null'){
                                                          outp +=`<small class="m-l-10">Start Date:<strong class="f-14"> ${str.start_date}</strong></small>`;
                                                        }
                                                        if(str.due_date!='null'){
                                                          outp +=`<small class="m-l-10">Due Date:<strong class="f-14"> ${str.due_date}</strong></small>`;
                                                        }
                                                        if(str.is_recurrsive>0){
                                                          outp +=`<small class="m-l-10">Repeat Type:<strong class="f-14">`;
                                                            if(str.repeat_type=='W'){
                                                              outp +=` Week `;
                                                            } else if(str.repeat_type=='M'){
                                                              outp +=` Month `;
                                                            }else{
                                                              outp +=` Year `;
                                                            }
                                                           outp +=`</strong></small><small class="m-l-10"> Repeat Schedule:<strong class="f-14"> ${str.repeat_schedule}</strong></small>`;
                                                         }
                                                     `</div>
                                                  </div>
                                              </div>
                                          </div>`;
                                          outp +=`<br/><br/><button class="btn btn-block btn-lg btn-default btn-icon-text waves-effect" onclick="taskDetailsPage('${str.task_id}'); return false;"> Task Details</button>`;
                                   return outp;
                              }
                          }
                    });
                  } else {
                    $("#a-task_assigned_list-datatable").bootgrid('destroy');
                    $('#a-task_assigned_list-datatable-body').html(str);
                    $("#a-task_assigned_list-datatable").bootgrid({
                          css: {
                              icon: 'zmdi icon',
                              iconColumns: 'zmdi-view-module',
                              iconDown: 'zmdi-expand-more',
                              iconRefresh: 'zmdi-refresh',
                              iconUp: 'zmdi-expand-less'
                          },
                          formatters: {
                              "t_list": function(column, row) {
                                  var outp = '';
                                  var pgrs='';
                                  var cardClr='';
                                  var task_type='';
                                  var over_due=0;
                                  str = JSON.parse(row.tlist);
                                  if(str.is_completed==1){
                                    pgrs = 'completed';
                                    cardClr='Green';
                                  } else if (str.progress==1){
                                    pgrs = 'in progress';
                                    cardClr='Yellow';
                                  } else{
                                    pgrs = 'not attended';
                                    cardClr='Red';
                                  }
                                  var myDate = new Date(str.due_date);
                                  var today = new Date();
                                  if ( myDate < today ) {
                                    over_due = 'OVERDUE';
                                  }
                                  task_type = str.task_type.length>0 && str.task_type!='NULL' ? str.task_type : false;
                                   outp = `<div class="card c-dark palette-${cardClr}-300 bg" style="margin-bottom: 0px !important;">
                                              <div class="card-header text-center" style="padding-bottom: 0px !important;">
                                                  <h1 class="m-l-10 c-white f-20"></h1>
                                              </div>
                                              <div class="card-body card-padding">
                                                  <div class="row">
                                                      <div class="col-md-9">
                                                          <p class="c-black text-justify f-14">`;
                                                           if(str.creator_id!=str.assignee_id){
                                                              outp +=`Assigned to <strong>${str.assignee} [${task_type}] ${ over_due!=0 ? `[${over_due}]` : ''} ${ str.redo_task==1 ? '[ReDo]' : '' }</strong>`;
                                                           }
                                                           if(str.parent_id>0){
                                                              outp +=`<strong>[Subtask]</strong>`;
                                                           }
                                                           if(str.is_parent==1){
                                                              outp +=`<strong>[Parenttask]</strong>`;
                                                           }
                                                           outp +=`<span class="pull-right">`;
                                                           if(str.is_collaborative>0){
                                                            outp +=` <i class="zmdi zmdi-tag zmdi-hc-fw"></i><span> Collaborative</span>`;
                                                           }
                                                           if(str.is_recurrsive>0){
                                                            outp +=` <i class="zmdi zmdi-tag zmdi-hc-fw"></i><span> Recurrsive</span>`;
                                                           }
                                                           if(str.project_id>0){
                                                             outp +=` <i class="zmdi zmdi-tag zmdi-hc-fw"></i><span> Project Task</span>`;
                                                           } else if(str.department_id>0) {
                                                             outp +=` <i class="zmdi zmdi-tag zmdi-hc-fw"></i><span> Department Task</span>`;
                                                           } else if(str.associate_group>0) {
                                                              outp +=` <i class="zmdi zmdi-tag zmdi-hc-fw"></i><span> Group Task</span>`;
                                                           }
                                                           outp +=`</span>`;
                                                          outp +=`</p>
                                                          <p class="c-black text-justify f-15">
                                                              ${str.task_title}
                                                          </p>
                                                          <p class="c-black text-justify">
                                                              ${str.task_desc}
                                                          </p>
                                                      </div>
                                                      <div class="col-md-3">
                                                          <button class="m-b-2 btn btn-block btn-default btn-icon-text waves-effect" onclick="taskComments('${str.task_id}'); return false;"><i class="zmdi zmdi-comment-alt-text"></i> View Comments</button>
                                                          <button class="m-b-2 btn btn-block btn-default btn-icon-text waves-effect" onclick="taskStatusUpdate('${str.task_id}'); return false;"><i class="zmdi zmdi-swap"></i> Change status</button>
                                                          <button class="m-b-2 btn btn-block btn-default btn-icon-text waves-effect" onclick="taskRedoTask('${str.task_id}'); return false;"><i class="zmdi zmdi-refresh"></i> Redo Task</button>
                                                          <button class="m-b-2 btn btn-block btn-default btn-icon-text waves-effect" onclick="taskExceptionRaised('${str.task_id}'); return false;"><i class="zmdi zmdi-pin-help"></i> ${str.exception_raised==0 ? 'Raise Exception' : 'Exception Raised'}</button>
                                                          <button class="m-b-2 btn btn-block btn-default btn-icon-text waves-effect" onclick="taskDelete('${str.task_id}'); return false;"><i class="zmdi zmdi-delete"></i> Delete Task</button>`;
                                                          //<button class="m-b-2 btn btn-block btn-default btn-icon-text waves-effect" onclick="taskEdit(${str.task_id}); return false;"><i class="zmdi zmdi-edit"></i> Edit Task</button>
                                                          outp += `<button class="m-b-2 btn btn-block btn-default btn-icon-text waves-effect" onclick="taskSubtask('${str.task_id}'); return false;"><i class="zmdi zmdi-pin-help"></i> Add Subtask</button>
                                                      </div>
                                                  </div>
                                                  <div class="m-t-5 row">
                                                     <div class="col-md-12 c-black">
                                                        <button class="btn palette-Teal bg btn-icon-text waves-effect" onclick="ataskMoreInfo('${str.task_id}'); return false;"><i class="zmdi zmdi-more-vert"></i> More</button>
                                                        <small class="m-l-10">Created On:<strong class="f-14"> ${str.created_at} </strong></small>`
                                                        if(str.start_date!='null'){
                                                          outp +=`<small class="m-l-10">Start Date:<strong class="f-14"> ${str.start_date}</strong></small>`;
                                                        }
                                                        if(str.due_date!='null'){
                                                          outp +=`<small class="m-l-10">Due Date:<strong class="f-14"> ${str.due_date}</strong></small>`;
                                                        }
                                                        if(str.is_recurrsive>0){
                                                          outp +=`<small class="m-l-10">Repeat Type:<strong class="f-14">`;
                                                            if(str.repeat_type=='W'){
                                                              outp +=` Week `;
                                                            } else if(str.repeat_type=='M'){
                                                              outp +=` Month `;
                                                            }else{
                                                              outp +=` Year `;
                                                            }
                                                           outp +=`</strong></small><small class="m-l-10"> Repeat Schedule:<strong class="f-14"> ${str.repeat_schedule}</strong></small>`;
                                                         }
                                                     `</div>
                                                  </div>
                                              </div>
                                          </div>`;
                                          outp +=`<br/><br/><button class="btn btn-block btn-lg btn-default btn-icon-text waves-effect" onclick="taskDetailsPage('${str.task_id}'); return false;"> Task Details</button>`;
                                   return outp;
                              }
                          }
                    });
                  }
            }else{
                if(!json.list){
                  str += `<tr>
                          <td colspan="4" class="text-center">No Record Found!</td>
                          </tr>`;
                }
                $('#a-task_assigned_list-datatable-body').html(str);
                createPopUpNotificaton(json.msg, 'danger');
            }
        }else{
             createPopUpNotificaton(json.msg, 'danger');
        }
        getaassignedtasklistcount++;
    });
}

// Associate > visact > get visact list
function getAccesscheck(component_id){
	//alert(component_id);
    // this will generate another thread to run in another function
    var access = false; 
	var request_data = {};
    request_data.data = {};
    request_data.url = path+'associate/visact/getAccessCheck';
    request_data.data.component_id = component_id;
    process_post_request(request_data, function(json){
	  return json.access;
          //callback(json.access); 
        /*if(json.status == 'Success')
		{
			var access=1;
			
	    }
		else
		{
			var access=0;
			
		}*/
	
    });
	//alert(access);
	//return access;
}
function escapeRegExp(string){

    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

}
function replaceAll(str, term, replacement) {

  return str.replace(new RegExp(escapeRegExp(term), 'g'), replacement);

}

var getavisactlistcount=0;
function getVisact(){
	var zone_id=$("#V_zone_report").val();
	//alert(zone_id);
    var request_data = {};
    request_data.data = {};
	request_data.data.zone_id = $("#V_zone_report").val();
    request_data.url = path+'associate/visact/listComponent';
    request_data.data.jwt = $.cookie('jwt');
    process_post_request(request_data, function(json){
        if(json.success){
            var str='';
            if(json.status == 200){
				
                  $.each(json.list, function(key, val){
					  
					  //alert(val.access);
					  //alert(val.associate_list);
					  var associate=val.associate_list;
					  var change1=replaceAll(associate, '"', '');
					  var change2=replaceAll(change1, ']', '');
					  var change3=replaceAll(change2, '[', '');
					  var associate_list=replaceAll(change3, ',', '_');
					  
					  //var associate_list='72_42_43';
					  //alert(change3);
					
                      str += `<tr>
                            <td>
                                { "component_id": "${val.id}","associate_list": "${associate_list}","zone_id": "${val.zone_id}",  "part_name": "${val.part_name}", "part_no": "${val.part_no}", "month": ${val.months}, "created_at": "${val.created_at}", "access": "${val.access}"}
                            </td>
                          </tr>`;
						  
						  /*str +='<tr><td>';
						  str +='{"component_id":"'+val.id+'","associate_list":"'+associate_list+'","zone_id":"'+val.zone_id+'","part_name":"'+val.part_name+'","part_no":"'+val.part_no+'","month":"'+val.months+'","created_at":"'+val.created_at+'"}';
						  str +='</td></tr>';
						  */
                  });
                  $('#a-visact_component_list-datatable-body').html(str);
                  if(!getavisactlistcount){
					 
                    // VISACT Card
                    $("#a-visact_component_list-datatable").bootgrid({
                          css: {
                              icon: 'zmdi icon',
                              iconColumns: 'zmdi-view-module',
                              iconDown: 'zmdi-expand-more',
                              iconRefresh: 'zmdi-refresh',
                              iconUp: 'zmdi-expand-less'
                          },
                          formatters: {
                              "t_list": function(column, row) {
                                   str = JSON.parse(row.tlist);
								   console.log(str);
								   var component_id=str.component_id;
								   var user_access=str.access;
								   //alert(component_id+"/"+user_access);
								   //var test_access=getAccesscheck(component_id);
								  /* var a_list=str.associate_list;
								   var associate_array= a_list.split('_');
								  
								  if(jQuery.inArray(logged_associate_id, associate_array) != -1) {
										var user_access=1;
									} else {
										var user_access=0;
									} 
								  */
			  
                                   outp = `<div onclick="getMonthList('${str.month}', '${str.component_id}'); return false;" class="card c-dark z-depth-1" style="margin-bottom: 0px !important;">
                                              <div class="card-body card-padding">
                                                  <div class="row">
                                                      <p class="c-black text-justify f-16">
                                                          ${str.part_name}
                                                      </p>
                                                      <p class="c-black text-justify">
                                                         Part no: ${str.part_no}
                                                      </p>
                                                  </div>
                                              </div>
                                          </div>`;
										  if(user_access==1){
                                         outp +=`<button class="visact_edit_component btn btn-default btn-icon waves-effect waves-circle waves-float pull-right c-black" onclick="editVisact('${str.component_id}','${str.part_name}','${str.part_no}','${str.zone_id}','${str.associate_list}'); return false;"><i class="zmdi zmdi-edit zmdi-hc-fw"></i></button>
                                                   <button class="visact_del_component btn btn-default btn-icon waves-effect waves-circle waves-float pull-right c-red" onclick="delComponent('${str.component_id}'); return false;"><i class="zmdi zmdi-delete zmdi-hc-fw"></i></button>`;
										  }
								   return outp;
                              }
                          }
                    });
                  } else {
					 
                    $("#a-visact_component_list-datatable").bootgrid('destroy');
                    $('#a-visact_component_list-datatable-body').html(str);
                    $("#a-visact_component_list-datatable").bootgrid({
                          css: {
                              icon: 'zmdi icon',
                              iconColumns: 'zmdi-view-module',
                              iconDown: 'zmdi-expand-more',
                              iconRefresh: 'zmdi-refresh',
                              iconUp: 'zmdi-expand-less'
                          },
                          formatters: {
                              "t_list": function(column, row) {
                                   str = JSON.parse(row.tlist);
								   var component_id=str.component_id;
								    
								  var user_access=str.access;
								   
                                   outp = `<div onclick="getMonthList('${str.month}', '${str.component_id}'); return false;" class="card c-dark z-depth-1" style="margin-bottom: 0px !important;">
                                              <div class="card-body card-padding">
                                                  <div class="row">
                                                      <p class="c-black text-justify f-16">
                                                          ${str.part_name}
                                                      </p>
                                                      <p class="c-black text-justify">
                                                         Part no: ${str.part_no}
                                                      </p>
                                                  </div>
                                              </div>
                                          </div>`;
										  if(user_access==1){
										   outp +=`<button class="visact_edit_component btn btn-default btn-icon waves-effect waves-circle waves-float pull-right c-black" onclick="editVisact('${str.component_id}','${str.part_name}','${str.part_no}','${str.zone_id}','${str.associate_list}'); return false;"><i class="zmdi zmdi-edit zmdi-hc-fw"></i></button>
                                          <button class="visact_del_component btn btn-default btn-icon waves-effect waves-circle waves-float pull-right c-red" onclick="delComponent('${str.component_id}'); return false;"><i class="zmdi zmdi-delete zmdi-hc-fw"></i></button>`;
										  }
								   return outp;
                              }
                          }
                    });
                  }
            }else{
                if(!json.list){
                  str += `<tr>
                          <td colspan="4" class="text-center">No Record Found!</td>
                          </tr>`;
                }
                $('#a-visact_component_list-datatable-body').html(str);
                createPopUpNotificaton(json.msg, 'danger');
            }
        }else{
             createPopUpNotificaton(json.msg, 'danger');
        }
        getavisactlistcount++;
    });
}

// Associate > request > get all request list
var getarequestlistcount=0;
function getRequest(){
    var request_data = {};
    request_data.data = {};
    request_data.url = path+'associate/request/get_all_request';
    request_data.data.jwt = $.cookie('jwt');
    process_post_request(request_data, function(json){
        if(json.success){
            var str='';
            if(json.status == 200){
                  $.each(json.list, function(key, val){
                      str += `<tr>
                            <td>
                                {"request_id": "${val.id}", "project_title": "${val.project_id[0].project_title}", "description": "${val.description}", "creator_id": "${val.creator[0].id}", "creator_name": "${val.creator[0].name}", "assignee_id": "${val.assignee[0].id}","assignee_name": "${val.assignee[0].name}", "attachment_list": ${val.attachment_list}, "start_date": "${val.start_date}", "due_date": "${val.due_date}","state": "${val.state}", "is_critical": ${val.is_critical},"me":"${val.me}"}
                            </td>
                          </tr>`;
                  });
                  $('#a-request_list-datatable-body').html(str);
                  if(!getarequestlistcount){
                    $("#a-request_list-datatable").bootgrid({
                          css: {
                              icon: 'zmdi icon',
                              iconColumns: 'zmdi-view-module',
                              iconDown: 'zmdi-expand-more',
                              iconRefresh: 'zmdi-refresh',
                              iconUp: 'zmdi-expand-less'
                          },
                         formatters: {
                              "t_list": function(column, row) {
                                   str = JSON.parse(row.tlist);
                                   outp = `<div class="card c-dark z-depth-1" style="margin-bottom: 0px !important;">
                                              <div class="card-body card-padding">
                                                  <div class="row">
                                                    <div class="col-md-9">
                                                        <p class="c-black text-justify">`;
                                                          if(str.creator_id==str.me){
                                                            outp +=`You requested <strong>${str.assignee_name}</strong>`;
                                                          } else {
                                                            outp +=`Requested by <strong>${str.creator_name}</strong>`;
                                                          }
                                                outp +=`</p>`;
                                                        if(str.project_title!='undefined'){
                                                          outp +=`<p class="c-black text-justify f-16">${str.project_title}</p>`;
                                                        }
                                                    outp +=`
                                                        <p class="c-black text-justify" style="white-space: initial;">
                                                           ${str.description}
                                                        </p>
                                                        <p class="c-black text-justify">
                                                           Start: ${str.start_date} Due: ${str.due_date}
                                                        </p>`;
                                                     if(str.attachment_list){
                                                       $.each(str.attachment_list, function(key, val1){
                                                         outp +=`<a href="${val1.destination}" target="_blank">${val1.destination.replace("/uploads/associates/request_attachments/", "")}</a>`;
                                                       });
                                                     }
                                                    outp +=`</div>
                                                    <div class="col-md-3">
                                                       <button class="m-b-15 btn btn-block btn-default btn-icon-text waves-effect" onclick="editRequest('${str.request_id}', ${str.creator_id}); return false;"><i class="zmdi zmdi-edit"></i> Edit Request</button><br>
                                                        <button class="btn btn-block btn-default btn-icon-text waves-effect" onclick="deleteRequest('${str.request_id}', ${str.creator_id}); return false;"><i class="zmdi zmdi-delete"></i> Delete Request</button>
                                                    </div>
                                                  </div>
                                              </div>
                                          </div>`;
                                        if(str.creator_id!=str.me){
                                         outp+=`<button class="btn btn-default col-md-4 m-2 bgm-gray btn-lg waves-effect" onclick="viewRequestCommentsModel('${str.request_id}'); return false;"><strong>Comments</strong></button>
                                          <button class="btn btn-default col-md-4 m-2 bgm-gray btn-lg waves-effect" onclick="rejectRequest('${str.request_id}'); return false;"><strong>Reject</strong></button>
                                          <button class="btn btn-default col-md-4 m-2 bgm-gray btn-lg waves-effect" onclick="approveRequest('${str.request_id}'); return false;"><strong>Approval</strong></button>`;
                                      } else {
					outp+=`<button class="btn btn-default col-md-12 m-2 bgm-gray btn-lg waves-effect" onclick="viewRequestCommentsModel('${str.request_id}'); return false;"><strong>Comments</strong></button>`;
                                      }
                                   return outp;
                              }
                          }
                    });
                  }
                   else {
                    $("#a-request_list-datatable").bootgrid('destroy');
                    $('#a-request_list-datatable-body').html(str);
                    $("#a-request_list-datatable").bootgrid({
                          css: {
                              icon: 'zmdi icon',
                              iconColumns: 'zmdi-view-module',
                              iconDown: 'zmdi-expand-more',
                              iconRefresh: 'zmdi-refresh',
                              iconUp: 'zmdi-expand-less'
                          },
                         formatters: {
                              "t_list": function(column, row) {
                                   str = JSON.parse(row.tlist);
                                   outp = `<div class="card c-dark z-depth-1" style="margin-bottom: 0px !important;">
                                              <div class="card-body card-padding">
                                                  <div class="row">
                                                    <div class="col-md-9">
                                                        <p class="c-black text-justify">`;
                                                        if(str.creator_id==str.me){
                                                          outp +=`You requested <strong>${str.assignee_name}</strong>`;
                                                        } else {
                                                          outp +=`Requested by <strong>${str.creator_name}</strong>`;
                                                        }
                                                outp +=`</p>`;
                                                        if(str.project_title!='undefined'){
                                                          outp +=`<p class="c-black text-justify f-16">${str.project_title}</p>`;
                                                        }
                                                    outp +=`
                                                        <p class="c-black text-justify" style="white-space: initial;">
                                                           ${str.description}
                                                        </p>
                                                        <p class="c-black text-justify">
                                                           Start: ${str.start_date} Due: ${str.due_date}
                                                        </p>`;
                                                     if(str.attachment_list){
                                                       $.each(str.attachment_list, function(key, val1){
                                                         outp +=`<a href="${val1.destination}" target="_blank">${val1.destination.replace("/uploads/associates/request_attachments/", "")}</a>`;
                                                       });
                                                     }
                                                    outp +=`</div>
                                                    <div class="col-md-3">
                                                       <button class="m-b-15 btn btn-block btn-default btn-icon-text waves-effect" onclick="editRequest('${str.request_id}', ${str.creator_id}); return false;"><i class="zmdi zmdi-edit"></i> Edit Request</button><br>
                                                        <button class="btn btn-block btn-default btn-icon-text waves-effect" onclick="deleteRequest('${str.request_id}', ${str.creator_id}); return false;"><i class="zmdi zmdi-delete"></i> Delete Request</button>
                                                    </div>
                                                  </div>
                                              </div>
                                          </div>`;
 					if(str.creator_id!=str.me){
                                         outp+=`<button class="btn btn-default col-md-4 m-2 bgm-gray btn-lg waves-effect" onclick="viewRequestCommentsModel('${str.request_id}'); return false;"><strong>Comments</strong></button>
                                          <button class="btn btn-default col-md-4 m-2 bgm-gray btn-lg waves-effect" onclick="rejectRequest('${str.request_id}'); return false;"><strong>Reject</strong></button>
                                          <button class="btn btn-default col-md-4 m-2 bgm-gray btn-lg waves-effect" onclick="approveRequest('${str.request_id}'); return false;"><strong>Approval</strong></button>`;
                                      } else {
					outp+=`<button class="btn btn-default col-md-12 m-2 bgm-gray btn-lg waves-effect" onclick="viewRequestCommentsModel('${str.request_id}'); return false;"><strong>Comments</strong></button>`;
                                      }
                                   return outp;
                              }
                          }
                    });
                  }
            }else{
                if(!json.list){
                  str += `<tr>
                          <td colspan="4" class="text-center">No Record Found!</td>
                          </tr>`;
                }
                $('#a-request_list-datatable-body').html(str);
                createPopUpNotificaton(json.msg, 'danger');
            }
        }else{
             createPopUpNotificaton(json.msg, 'danger');
        }
        getarequestlistcount++;
    });
}

// Associate > decision > get all decisions list
var getadecisionlistcount=0;
function getDecision(){
    var request_data = {};
    request_data.data = {};
    request_data.url = path+'associate/decision/get_all_decisions';
    request_data.data.jwt = $.cookie('jwt');
    process_post_request(request_data, function(json){
        if(json.success){
            var str='';
            if(json.status == 200){
                  $.each(json.list, function(key, val){
					  if((val.project_id!='')&&(val.project_id!=0)&&(val.project_id!=null))
					  {
						 var project_name= val.project_id[0].project_title;
					  }
					  else{
						  var project_name='';
					  }
					  
					  if((val.department_id!='')&&(val.department_id!=0)&&(val.department_id!=null))
					  {
						 var dept_name= val.department_id[0].dept_name;
					  }
					  else{
						  var dept_name='';
					  }
					  
					  
                      str += `<tr>
                            <td>
                                {"decision_id": "${val.id}", "creator_id": "${val.creator[0].id}", "creator_name": "${val.creator[0].name}", "title": "${val.title}", "project_name": "${project_name}", "department_name": "${dept_name}", "problem": "${val.problem}", "problem_attachment": "${val.problem_attachment}", "reason": "${val.reasoning}", "decision": "${val.decision}","created_at": "${val.created_at}"}
                            </td>
                          </tr>`;
                  });
                  $('#a-decision_list-datatable-body').html(str);
                  if(!getadecisionlistcount){
                    $("#a-decision_list-datatable").bootgrid({
                          css: {
                              icon: 'zmdi icon',
                              iconColumns: 'zmdi-view-module',
                              iconDown: 'zmdi-expand-more',
                              iconRefresh: 'zmdi-refresh',
                              iconUp: 'zmdi-expand-less'
                          },
                          formatters: {
                              "t_list": function(column, row) {
                                   str = JSON.parse(row.tlist);
                                   outp = `<div class="card c-dark z-depth-1" style="margin-bottom: 0px !important;">
                                              <div class="card-body card-padding">
                                                  <div class="row">
                                                      <div class="col-md-9">
                                                        <p class="c-black text-justify m-b-0"><b>Creator: </b>${str.creator_name}</p>
                                                        <p class="c-black text-justify f-16 m-b-0">
                                                           <b>Title: </b>${str.title}
                                                        </p>
                                                        <p class="c-black text-justify m-b-0">
                                                           <b>Project/Department: </b>${str.project_name!='undefined' ? str.project_name : ' - '} / ${str.department_name!='undefined' ? str.department_name : ' - '}
                                                        </p>
                                                        <p class="c-black text-justify m-b-0">
                                                           <b>Problem: </b>${str.problem}
                                                        </p>
                                                        <p class="c-black text-justify m-b-0">
                                                           <b>Reason: </b>${str.reason}
                                                        </p>
                                                        <p class="c-black text-justify m-b-0">
                                                           <b>Decision: </b>${str.decision}
                                                        </p>`;
                                                        var attachments = str.problem_attachment.split(",");
                                                        if(attachments[0]!='0' && attachments[0]!='null'){
                                                          $.each(attachments, function(key, val){
                                                            if(val){
                                                              if(val.charAt(0)=='.'){
                                                                   outp += `<p class="c-black text-justify m-b-0">Attachment: <a target="_blank" href="${path+val.substr(2)}">${val.split("decision_attachments/").pop()}</a></p>`;
                                                               } else {
                                                                    outp += `<p class="c-black text-justify m-b-0">
                                                                       Attachment: <a target="_blank" href="${path+val.substr(1)}">${val.split("decision_attachments/").pop()}</a></p>`;
                                                               }
                                                            }
                                                          });
                                                      }
                                                      outp +=`</div>
                                                      <div class="col-md-3">
                                                        <button class="m-b-2 btn btn-block btn-default btn-icon-text waves-effect" onclick="editDecision('${str.decision_id}', ${str.creator_id}); return false;"><i class="zmdi zmdi-edit"></i> Edit Decision</button>
                                                        <button class="m-b-2 btn btn-block btn-default btn-icon-text waves-effect" onclick="deleteDecision('${str.decision_id}', ${str.creator_id}); return false;"><i class="zmdi zmdi-delete"></i> Delete Decision</button>
                                                      </div>
                                                  </div>
                                              </div>
                                          </div>`;
                                   return outp;
                              }
                          }
                    });
                  }
                   else {
                    $("#a-decision_list-datatable").bootgrid('destroy');
                    $('#a-decision_list-datatable-body').html(str);
                    $("#a-decision_list-datatable").bootgrid({
                          css: {
                              icon: 'zmdi icon',
                              iconColumns: 'zmdi-view-module',
                              iconDown: 'zmdi-expand-more',
                              iconRefresh: 'zmdi-refresh',
                              iconUp: 'zmdi-expand-less'
                          },
                          formatters: {
                              "t_list": function(column, row) {
                                   str = JSON.parse(row.tlist);
                                   outp = `<div class="card c-dark z-depth-1" style="margin-bottom: 0px !important;">
                                              <div class="card-body card-padding">
                                                  <div class="row">
                                                      <div class="col-md-9">
                                                        <p class="c-black text-justify m-b-0"><b>Creator: </b>${str.creator_name}</p>
                                                        <p class="c-black text-justify f-16 m-b-0">
                                                           <b>Title: </b>${str.title}
                                                        </p>
                                                        <p class="c-black text-justify m-b-0">
                                                           <b>Project/Department: </b>${str.project_name!='undefined' ? str.project_name : ' - '} / ${str.department_name!='undefined' ? str.department_name : ' - '}
                                                        </p>
                                                        <p class="c-black text-justify m-b-0">
                                                           <b>Problem: </b>${str.problem}
                                                        </p>
                                                        <p class="c-black text-justify m-b-0">
                                                           <b>Reason: </b>${str.reason}
                                                        </p>
                                                        <p class="c-black text-justify m-b-0">
                                                           <b>Decision: </b>${str.decision}
                                                        </p>`;
                                                        var attachments = str.problem_attachment.split(",");
                                                        if(attachments[0]!='0'){
                                                          $.each(attachments, function(key, val){
                                                            if(val){
                                                              if(val.charAt(0)=='.'){
                                                                   outp += `<p class="c-black text-justify m-b-0">Attachment: <a target="_blank" href="${path+val.substr(2)}">${val.split("decision_attachments/").pop()}</a></p>`;
                                                               } else {
                                                                    outp += `<p class="c-black text-justify m-b-0">
                                                                       Attachment: <a target="_blank" href="${path+val.substr(1)}">${val.split("decision_attachments/").pop()}</a></p>`;
                                                               }
                                                            }
                                                          });
                                                      }
                                                      outp +=`</div>
                                                      <div class="col-md-3">
                                                        <button class="m-b-2 btn btn-block btn-default btn-icon-text waves-effect" onclick="editDecision('${str.decision_id}', ${str.creator_id}); return false;"><i class="zmdi zmdi-edit"></i> Edit Decision</button>
                                                        <button class="m-b-2 btn btn-block btn-default btn-icon-text waves-effect" onclick="deleteDecision('${str.decision_id}', ${str.creator_id}); return false;"><i class="zmdi zmdi-delete"></i> Delete Decision</button>
                                                      </div>
                                                  </div>
                                              </div>
                                          </div>`;
                                   return outp;
                              }
                          }
                    });
                  }
            }else{
                if(!json.list){
                  str += `<tr>
                          <td colspan="4" class="text-center">No Record Found!</td>
                          </tr>`;
                }
                $('#a-decision_list-datatable-body').html(str);
                createPopUpNotificaton(json.msg, 'danger');
            }
        }else{
             createPopUpNotificaton(json.msg, 'danger');
        }
        getadecisionlistcount++;
    });
}


// var getaassignedtasklistcount=0;
// function getAssignedTask(){
//     var request_data = {};
//     request_data.data = {};
//     request_data.url = path+'associate/task/get_assigned_task';
//     request_data.data.jwt = $.cookie('jwt');
//     var task_status_data = {
//                           'not attended' : {
//                              'msg': 'Not Attended',
//                              'color': 'palette-Red bg'
//                           },
//                           'in progress' : {
//                              'msg': 'In Progress',
//                              'color': 'palette-Amber bg'
//                           },
//                           'completed' : {
//                              'msg': 'Completed',
//                              'color': 'palette-Green bg'
//                           }
//                         }
//     process_post_request(request_data, function(json){
//         if(json.success){
//             if(json.status == 200){
//                   var str='';
//                   $.each(json.list, function(key, val){
//                       str += `<tr>
//                             <td>
//                                 { "task_id": ${val.id}, "task_desc": "${val.description}", "created_at": "${val.created_at}", "start_date": "${val.start_date}", "due_date": "${val.due_date}", "creator": "${val.creator[0].name}", "creator_id": "${val.creator[0].id}", "assignee": "${val.assignee[0].name}", "assignee_id": "${val.assignee[0].id}", "progress": "${val.progress}", "is_completed": "${val.is_complete}" }
//                             </td>
//                           </tr>`;
//                   });
//                   $('#a-task_assigned_list-datatable-body').html(str);
//                   if(!getaassignedtasklistcount){
//                     // Task Card
//                     $("#a-task_assigned_list-datatable").bootgrid({
//                           css: {
//                               icon: 'zmdi icon',
//                               iconColumns: 'zmdi-view-module',
//                               iconDown: 'zmdi-expand-more',
//                               iconRefresh: 'zmdi-refresh',
//                               iconUp: 'zmdi-expand-less'
//                           },
//                           formatters: {
//                               "t_list": function(column, row) {
//                                    var outp = '';
//                                    str = JSON.parse(row.tlist);
//                                    outp = `<div class="card c-dark palette-Indigo-400 bg" style="margin-bottom: 0px !important;">
//                                               <div class="card-header text-center" style="padding-bottom: 0px !important;">
//                                                   <h1 class="m-l-10 c-white f-20"></h1>
//                                               </div>
//                                               <div class="card-body card-padding">
//                                                   <div class="row">
//                                                       <div class="col-md-9">
//                                                           <p class="c-white text-justify f-14">
//                                                           `;
//                                                            if(str.creator_id==str.assignee_id){
//                                                               outp +=`<strong>Self Assigned</strong>`;
//                                                            } else {
//                                                               outp +=`Assigned to <strong>${str.assignee}</strong>`;
//                                                            }
//                                                            var pgrs='';
//                                                            if(str.is_completed!='0'){
//                                                               pgrs = 'completed';
//                                                            } else if (str.progress!='0'){
//                                                               pgrs = 'in progress';
//                                                            } else{
//                                                               pgrs = 'not attended';
//                                                            }
//                                                           outp +=`</p>
//                                                           <p class="c-white text-justify">
//                                                               ${str.task_desc}
//                                                           </p>
//                                                       </div>
//                                                       <div class="col-md-3">
//                                                           <button class="m-b-2 btn btn-block ${task_status_data[pgrs].color} btn-icon-text"><i class="zmdi zmdi-assignment-check"></i> ${task_status_data[pgrs].msg}</button>
//                                                           <button class="m-b-2 btn btn-block btn-default btn-icon-text waves-effect" onclick="editTask(${str.task_id}); return false;"><i class="zmdi zmdi-edit"></i> Edit Task Data</button>
//                                                           <button class="m-b-2 btn btn-block btn-default btn-icon-text waves-effect" onclick="taskComments(${str.task_id}); return false;"><i class="zmdi zmdi-comment-alt-text"></i> View Comments</button>
//                                                       </div>
//                                                   </div>
//                                                   <div class="m-t-5 row">
//                                                      <div class="col-md-12 c-white">
//                                                         <button class="btn palette-Teal bg btn-icon-text waves-effect" onclick="ataskMoreInfo(${str.task_id}); return false;"><i class="zmdi zmdi-more-vert"></i> More</button>
//                                                         <small class="m-l-10">Created On:<strong class="f-14"> ${str.created_at} </strong></small>`
//                                                         if(str.start_date!='null'){
//                                                           outp +=`<small class="m-l-10">Start Date:<strong class="f-14"> ${str.start_date}</strong></small>`;
//                                                         }
//                                                         if(str.due_date!='null'){
//                                                           outp +=`<small class="m-l-10">Due Date:<strong class="f-14"> ${str.due_date}</strong></small>`;
//                                                         }
//                                                      `</div>
//                                                   </div>
//                                               </div>
//                                           </div>`;
//                                    return outp;
//                               }
//                           }
//                     });
//                   }
//                   else {
//                     $("#a-task_assigned_list-datatable").bootgrid('destroy');
//                     $('#a-task_assigned_list-datatable-body').html(str);
//                     $("#a-task_assigned_list-datatable").bootgrid({
//                           css: {
//                               icon: 'zmdi icon',
//                               iconColumns: 'zmdi-view-module',
//                               iconDown: 'zmdi-expand-more',
//                               iconRefresh: 'zmdi-refresh',
//                               iconUp: 'zmdi-expand-less'
//                           },
//                           formatters: {
//                                "t_list": function(column, row) {
//                                    var outp = '';
//                                    str = JSON.parse(row.tlist);
//                                    outp = `<div class="card c-dark palette-Indigo-400 bg" style="margin-bottom: 0px !important;">
//                                               <div class="card-header text-center" style="padding-bottom: 0px !important;">
//                                                   <h1 class="m-l-10 c-white f-20"></h1>
//                                               </div>
//                                               <div class="card-body card-padding">
//                                                   <div class="row">
//                                                       <div class="col-md-9">
//                                                           <p class="c-white text-justify f-14">
//                                                           `;
//                                                            if(str.creator_id==str.assignee_id){
//                                                               outp +=`<strong>Self Assigned</strong>`;
//                                                            } else {
//                                                               outp +=`Assigned to <strong>${str.assignee}</strong>`;
//                                                            }
//                                                            var pgrs='';
//                                                            if(str.is_completed!='0'){
//                                                               pgrs = 'completed';
//                                                            } else if (str.progress!='0'){
//                                                               pgrs = 'in progress';
//                                                            } else{
//                                                               pgrs = 'not attended';
//                                                            }
//                                                           outp +=`</p>
//                                                           <p class="c-white text-justify">
//                                                               ${str.task_desc}
//                                                           </p>
//                                                       </div>
//                                                       <div class="col-md-3">
//                                                           <button class="m-b-2 btn btn-block ${task_status_data[pgrs].color} btn-icon-text"><i class="zmdi zmdi-assignment-check"></i> ${task_status_data[pgrs].msg}</button>
//                                                           <button class="m-b-2 btn btn-block btn-default btn-icon-text waves-effect" onclick="editTask(${str.task_id}); return false;"><i class="zmdi zmdi-edit"></i> Edit Task Data</button>
//                                                           <button class="m-b-2 btn btn-block btn-default btn-icon-text waves-effect" onclick="taskComments(${str.task_id}); return false;"><i class="zmdi zmdi-comment-alt-text"></i> View Comments</button>
//                                                       </div>
//                                                   </div>
//                                                   <div class="m-t-5 row">
//                                                      <div class="col-md-12 c-white">
//                                                         <button class="btn palette-Teal bg btn-icon-text waves-effect" onclick="ataskMoreInfo(${str.task_id}); return false;"><i class="zmdi zmdi-more-vert"></i> More</button>
//                                                         <small class="m-l-10">Created On:<strong class="f-14"> ${str.created_at} </strong></small>`
//                                                         if(str.start_date!='null'){
//                                                           outp +=`<small class="m-l-10">Start Date:<strong class="f-14"> ${str.start_date}</strong></small>`;
//                                                         }
//                                                         if(str.due_date!='null'){
//                                                           outp +=`<small class="m-l-10">Due Date:<strong class="f-14"> ${str.due_date}</strong></small>`;
//                                                         }
//                                                      `</div>
//                                                   </div>
//                                               </div>
//                                           </div>`;
//                                    return outp;
//                               }
//                           }
//                     });
//                   }
//             }else{
//                 if(!json.list){
//                   str += `<tr>
//                           <td colspan="4" class="text-center">No Record Found!</td>
//                           </tr>`;
//                 }
//                 $('#a-task_list-datatable-body').html(str);
//                 createPopUpNotificaton(json.msg, 'danger');
//             }
//         }else{
//              createPopUpNotificaton(json.msg, 'danger');
//         }
//         getaassignedtasklistcount++;
//     });
// }

// Company Verify User
$("#company-forgot-password").submit(function(e){
    e.preventDefault();
    var err = 0;
    var request_data = {};
    request_data.url = path+'company/signin/reset_password';
    request_data.data = {};
    request_data.data.email = $.trim($("#email").val());
    request_data.data.mobile = $.trim($("#mobile").val());
    err += validateFormData(request_data.data.email, "#email", "Email");
    err += validateFormData(request_data.data.mobile, "#mobile", "Mobile No.");
    if(err == 0){
            form_btn_spinner_show($(this));
            process_post_request(request_data, function(json){
            $(".alert").remove();
            if(json.success){
                if(json.status == 200){
                    form_btn_spinner_hide("#company-forgot-password", "Verify");
                    $("#email-div, #mobile-div, #subBtn").hide();
                    $("#company-forgot-password").before("<div class='alert alert-success alert-dismissible' role='alert'>"+json.msg+"</div>");
                }else {
                    form_btn_spinner_hide("#company-forgot-password", "<i class='zmdi zmdi-refresh zmdi-hc-fw'></i>");
                    $("#company-forgot-password").before("<div class='alert alert-danger alert-dismissible' role='alert'>"+json.msg+"</div>");
                }
            }else{
                form_btn_spinner_hide("#company-forgot-password", "<i class='zmdi zmdi-refresh zmdi-hc-fw'></i>");
                $("#company-forgot-password").before("<div class='alert alert-danger alert-dismissible' role='alert'>"+json.msg+"</div>");
            }
        });
    }
});


// Company update password
$("#company-update-password").submit(function(e){
    e.preventDefault();
    var err = 0;
    var request_data = {};
    request_data.url = path+'company/signin/update_new_password';
    request_data.data = {};
    request_data.data.company_id = $.trim($("#company_id").val());
    request_data.data.newpassconf = $.trim($("#newpassconf").val());
    request_data.data.newpass = $.trim($("#newpass").val());
    err += validateFormData(request_data.data.newpassconf, "#newpassconf", "Confirm Password");
    err += validateFormData(request_data.data.newpass, "#newpass", "New Password");
    if(err == 0){
            form_btn_spinner_show($(this));
            process_post_request(request_data, function(json){
            $(".alert").remove();
            if(json.success){
                if(json.status == 200){
                    form_btn_spinner_hide("#company-update-password", "Update");
                    $("#newpass-div, #oldpass-div, #subBtn").hide();
                    $("#company-update-password").before("<div class='alert alert-success alert-dismissible' role='alert'>"+json.msg+"</div>");
                }else {
                    form_btn_spinner_hide("#company-update-password", "<i class='zmdi zmdi-refresh zmdi-hc-fw'></i>");
                    if(json.newpassconf){
                      $('#newpassconf').parent().addClass("has-error");
                      $('#newpassconf').next().remove();
                      $('#newpassconf').after(`<small class='text-danger'>${json.msg}</small>`);
                    } else {
                      $("#company-update-password").before("<div class='alert alert-danger alert-dismissible' role='alert'>"+json.msg+"</div>");
                    }
                }
            }else{
                form_btn_spinner_hide("#company-update-password", "<i class='zmdi zmdi-refresh zmdi-hc-fw'></i>");
                $("#company-update-password").before("<div class='alert alert-danger alert-dismissible' role='alert'>"+json.msg+"</div>");
            }
        });
    }
});

// Company Login
$("#company-login-frm").submit(function(e){
    e.preventDefault();
    var err = 0;
    var request_data = {};
    request_data.data = {};
    request_data.url = path+'company/signin/authenticate';
    request_data.data.email = $.trim($("#email").val());
    request_data.data.password = $.trim($("#password").val());
    request_data.data._token = $.cookie("_token_cookie");

    if(request_data.data.email.length>0 && /^\d+$/.test(request_data.data.email)){
      err += validateFormData(request_data.data.email, "#email", "Mobile No.");
    } else {
      err += validateFormData(request_data.data.email, "#email", "Email");
    }
    err += validateFormData(request_data.data.password, "#password", "Password");

    if(err == 0){
          form_btn_spinner_show($(this));
          process_get_request(request_data, function(json){
          $(".alert").remove();
            if(json.success){
                if(json.status == 200){
                    $.cookie('jwt', json.jwt_token);
                    location.href=path+'company/dashboard?status=login';
                }else{
                    form_btn_spinner_hide("#company-login-frm", "<i class='zmdi zmdi-refresh zmdi-hc-fw'></i>");
                    $(".main-header").after("<div class='alert alert-danger alert-dismissible' role='alert'>"+json.msg+"</div>");
                }
            }else{
                form_btn_spinner_hide("#company-login-frm", "<i class='zmdi zmdi-refresh zmdi-hc-fw'></i>");
                $(".main-header").after("<div class='alert alert-danger alert-dismissible' role='alert'>"+json.msg+"</div>");
            }
        });
    }
});

// Company Signup
$("#company-signup-frm").submit(function(e){
    e.preventDefault();
    var err = 0;
    var request_data = {};
    request_data.data = {};
    request_data.url = path+'company/signup/create_account';
    request_data.data.company_name = $.trim($("#company_name").val());
    request_data.data.email = $.trim($("#email").val());
    request_data.data.mobile_number = $.trim($("#mobile_number").val());
    request_data.data.password = $.trim($("#password").val());
    request_data.data.account_type = $.trim($("#account_type").val());;
    request_data.data.image_file = $("#image_file").val();

    if(request_data.data.company_name.length == 0){
      $("#company_name").parent().addClass("has-error");
      $("#company_name").next().remove();
      $("#company_name").after("<small class='text-danger'>Company name is missing.</small>");
      err++;
    }else{
      $("#company_name").parent().removeClass("has-error");
      $("#company_name").next().remove();
    }

    if(request_data.data.email.length == 0){
      $("#email").parent().addClass("has-error");
      $("#email").next().remove();
      $("#email").after("<small class='text-danger'>Email is missing.</small>");
      err++;
    } else if (!/(.+)@(.+){2,}\.(.+){2,}/.test(request_data.data.email)) {
      $("#email").parent().addClass("has-error");
      $("#email").next().remove();
      $("#email").after("<small class='text-danger'>Invalid Email address.</small>");
      err++;
    } else {
      $("#email").parent().removeClass("has-error");
      $("#email").next().remove();
    }

    if(request_data.data.mobile_number.length == 0){
      $("#mobile_number").parent().addClass("has-error");
      $("#mobile_number").next().remove();
      $("#mobile_number").after("<small class='text-danger'>Mobile number is missing.</small>");
      err++;
    } else if(!/^[6-9][0-9]{9}$/.test(request_data.data.mobile_number)) {
      $("#mobile_number").parent().addClass("has-error");
      $("#mobile_number").next().remove();
      $("#mobile_number").after("<small class='text-danger'>Invalid Mobile number.</small>");
      err++;
    } else {
      $("#mobile_number").parent().removeClass("has-error");
      $("#mobile_number").next().remove();
    }

    if(request_data.data.password.length == 0){
      $("#password").parent().addClass("has-error");
      $("#password").next().remove();
      $("#password").after("<small class='text-danger'>Password is missing.</small>");
      err++;
    }else{
      $("#password").parent().removeClass("has-error");
      $("#password").next().remove();
    }

    if(request_data.data.account_type.length == 0){
      $("#account_type").addClass("has-error");
      $(".ac-error-msg").remove();
      $(".btn-group.bootstrap-select.show-tick").after("<small class='text-danger ac-error-msg'>Account type is missing.</small>");
      err++;
    }else{
      $("#account_type").parent().removeClass("has-error");
    }

    if(err == 0){
        form_btn_spinner_show($(this));
        $.ajax({
          url: request_data['url'],
          method: "POST",
          data: new FormData(this),
          contentType: false,
          cache: false,
          processData: false,
          success: function(data){
            json = JSON.parse(data);
            $(".alert").remove();
            if(json.status == 200){
                $.cookie('jwt', json.jwt_token);
                location.href=path+'company/dashboard?status=login';
            }else{
                form_btn_spinner_hide("#company-signup-frm", "<i class='zmdi zmdi-refresh zmdi-hc-fw'></i> Submit");
                $(".main-header").after("<div class='alert alert-danger alert-dismissible' role='alert'>"+json.msg+"</div>");
            }
          }
        });
    }
});

//Company Department > get department list
var getcdepcount=0;
function getDepartment(){
  var request_data = {};
  request_data.data = {};
  request_data.url = path+'company/department/get_departments';
  request_data.data._token = $.cookie('_token_cookie');
  request_data.data.jwt = $.cookie('jwt');
  process_post_request(request_data, function(json){
      if(json.success){
          if(json.status == 200){
                var str='';
                $.each(json.list, function(key, val){
                    str += `<tr>
                           <td>${val.id}</td>
                           <td>${val.dept_name}</td>
                           <td>${val.dept_description}</td>
                           </tr>`;
                });
                $('#c-dep-datatable-body').html(str);
                if(!getcdepcount){
                  //Command Buttons
                  $("#c-dep-datatable").bootgrid({
                      css: {
                          icon: 'zmdi icon',
                          iconColumns: 'zmdi-view-module',
                          iconDown: 'zmdi-expand-more',
                          iconRefresh: 'zmdi-refresh',
                          iconUp: 'zmdi-expand-less'
                      },
                      formatters: {
                          "commands": function(column, row) {
                               return `<button type="button" onclick="editDepartment(${row.id},'${row.department_name}','${row.department_desc}'); return false;" class="btn  palette-Lime bg waves-effect" data-row-id="${row.id}"><span class="zmdi zmdi-edit"></span></button>
                                      <button type="button" onclick="deleteDepartmentid(${row.id}); return false;" class="btn btn-danger waves-effect" data-row-id="${row.id}"><span class="zmdi zmdi-delete"></span></button>`;
                          }
                      }
                  });
                } else {
                  $("#c-dep-datatable").bootgrid('destroy');
                   //Command Buttons
                  $('#c-dep-datatable-body').html(str);
                  $("#c-dep-datatable").bootgrid({
                      css: {
                          icon: 'zmdi icon',
                          iconColumns: 'zmdi-view-module',
                          iconDown: 'zmdi-expand-more',
                          iconRefresh: 'zmdi-refresh',
                          iconUp: 'zmdi-expand-less'
                      },
                      formatters: {
                          "commands": function(column, row) {
                               return `<button type="button" onclick="editDepartment(${row.id},'${row.department_name}','${row.department_desc}'); return false;" class="btn  palette-Lime bg waves-effect" data-row-id="${row.id}"><span class="zmdi zmdi-edit"></span></button>
                                      <button type="button" onclick="deleteDepartmentid(${row.id}); return false;" class="btn btn-danger waves-effect" data-row-id="${row.id}"><span class="zmdi zmdi-delete"></span></button>`;
                          }
                      }
                  });
                }
          }else{
              if(!json.list){
                str += `<tr>
                        <td colspan="4" class="text-center">No Record Found!</td>
                        </tr>`;
              }
              $('#c-dep-datatable-body').html(str);
              createPopUpNotificaton(json.msg, 'danger');
          }
      }else{
           createPopUpNotificaton(json.msg, 'danger');
      }
      getcdepcount++;
  });
}

// Company Department > add department
$("#add-department-frm").submit(function(e){
    e.preventDefault();
    var err = 0;
    var request_data = {};
    request_data.data = {};
    request_data.url = path+'company/department/add_department';
    request_data.data.department_name = $.trim($("#department_name").val());
    request_data.data.department_desc = $.trim($("#department_desc").val());
    request_data.data._token = $.cookie('_token_cookie');
    request_data.data.jwt = $.cookie('jwt');
    if(request_data.data.department_name.length == 0){
        $("#department_name").parent().addClass("has-error");
        $("#department_name").next().remove();
        $("#department_name").after("<small class='text-danger err'>Department Name is missing.</small>");
        err++;
    } else {
        $("#department_name").parent().removeClass("has-error");
        $("#department_name").next().remove();
    }
    if(!err){
      $(".add-department-modal-msg").empty();
      form_btn_spinner_show("#add-department-frm");
      process_post_request(request_data, function(json){
          if(json.success){
              if(json.status == 200){
                  form_btn_spinner_hide("#add-department-frm", "Add Department")
                  closeModelAndRest("#add-department-frm");
                  createPopUpNotificaton(json.msg, 'success');
                  getDepartment();
              }else{
                  if(json.msg=='Department name already exists'){
                      form_btn_spinner_hide("#add-department-frm", "Add Department")
                      $("#department_name").parent().addClass("has-error");
                      $("#department_name").next().remove();
                      $("#department_name").after("<small class='text-danger err'>"+json.msg+"</small>");
                      err++;
                  } else {
                      form_btn_spinner_hide("#add-department-frm", "Add Department")
                      closeModelAndRest("#edit-department-frm");
                      createPopUpNotificaton(json.msg, 'danger');
                  }
              }
          }else{
              form_btn_spinner_hide("#add-department-frm", "Add Department")
              closeModelAndRest("#edit-department-frm");
                      createPopUpNotificaton(json.msg, 'danger');
          }
      });
    }
});

// Company Department > edit department
$("#edit-department-frm").submit(function(e){
    e.preventDefault();
    var err = 0;
    var request_data = {};
    request_data.data = {};
    request_data.url = path+'company/department/edit_department';
    request_data.data.id = $.trim($("#edit_department_id").val());
    request_data.data.department_name = $.trim($("#edit_department_name").val());
    request_data.data.department_desc = $.trim($("#edit_department_desc").val());
    request_data.data._token = $.cookie('_token_cookie');
    request_data.data.jwt = $.cookie('jwt');
    if(request_data.data.department_name.length == 0){
        $("#edit_department_name").parent().addClass("has-error");
        $("#edit_department_name").next().remove();
        $("#edit_department_name").after("<small class='text-danger err'>Department Name is missing.</small>");
        err++;
    } else {
        $("#edit_department_name").parent().removeClass("has-error");
        $("#edit_department_name").next().remove();
    }
    if(!err){
      $(".edit-department-modal-msg").empty();
      form_btn_spinner_show("#edit-department-frm");
      process_post_request(request_data, function(json){
          if(json.success){
              if(json.status == 200){
                  form_btn_spinner_hide("#edit-department-frm", "Update Department");
                  closeModelAndRest("#edit-department-frm");
                  createPopUpNotificaton(json.msg, 'success');
                  getDepartment();
              }else{
                  if(json.msg=='Department name already exists'){
                      form_btn_spinner_hide("#edit-department-frm", "Update Department")
                      $("#edit_department_name").parent().addClass("has-error");
                      $("#edit_department_name").next().remove();
                      $("#edit_department_name").after("<small class='text-danger err'>"+json.msg+"</small>");
                      err++;
                  } else {
                      form_btn_spinner_hide("#edit-department-frm", "Update Department");
                      closeModelAndRest("#edit-department-frm");
                      createPopUpNotificaton(json.msg, 'danger');
                  }
              }
          }else{
              form_btn_spinner_hide("#edit-department-frm", "Update Department");
              closeModelAndRest("#edit-department-frm");
              createPopUpNotificaton(json.msg, 'danger');
          }
      });
    }
});

// Company Designation > get designation list
var getcdescount=0;
function getDesignation(){
  var request_data = {};
  request_data.data = {};
  request_data.url = path+'company/designation/get_designations';
  request_data.data._token = $.cookie('_token_cookie');
  request_data.data.jwt = $.cookie('jwt');
  process_post_request(request_data, function(json){
      if(json.success){
          if(json.status == 200){
                var str='';
                $.each(json.list, function(key, val){
                    str += `<tr>
                           <td>${val.id}</td>
                           <td>${val.designation_name}</td>
                           <td>${val.designation_desc}</td>
                           </tr>`;
                });
                $('#c-des-datatable-body').html(str);
                if(!getcdescount){
                  //Command Buttons
                  $("#c-des-datatable").bootgrid({
                      css: {
                          icon: 'zmdi icon',
                          iconColumns: 'zmdi-view-module',
                          iconDown: 'zmdi-expand-more',
                          iconRefresh: 'zmdi-refresh',
                          iconUp: 'zmdi-expand-less'
                      },
                      formatters: {
                          "commands": function(column, row) {
                               return `<button type="button" onclick="editDesignation(${row.id},'${row.designation_name}','${row.designation_desc}'); return false;" class="btn  palette-Lime bg waves-effect" data-row-id="${row.id}"><span class="zmdi zmdi-edit"></span></button>
                                      <button type="button" onclick="deleteDesignationid(${row.id}); return false;" class="btn btn-danger waves-effect" data-row-id="${row.id}"><span class="zmdi zmdi-delete"></span></button>`;
                          }
                      }
                  });
                } else {
                  $("#c-des-datatable").bootgrid('destroy');
                   //Command Buttons
                  $('#c-des-datatable-body').html(str);
                  $("#c-des-datatable").bootgrid({
                      css: {
                          icon: 'zmdi icon',
                          iconColumns: 'zmdi-view-module',
                          iconDown: 'zmdi-expand-more',
                          iconRefresh: 'zmdi-refresh',
                          iconUp: 'zmdi-expand-less'
                      },
                      formatters: {
                          "commands": function(column, row) {
                               return `<button type="button" onclick="editDesignation(${row.id},'${row.designation_name}','${row.designation_desc}'); return false;" class="btn  palette-Lime bg waves-effect" data-row-id="${row.id}"><span class="zmdi zmdi-edit"></span></button>
                                      <button type="button" onclick="deleteDesignationid(${row.id}); return false;" class="btn btn-danger waves-effect" data-row-id="${row.id}"><span class="zmdi zmdi-delete"></span></button>`;
                          }
                      }
                  });
                }
          }else{
              if(!json.list){
                str += `<tr>
                        <td colspan="4" class="text-center">No Record Found!</td>
                        </tr>`;
              }
              $('#c-des-datatable-body').html(str);
              createPopUpNotificaton(json.msg, 'danger');
          }
      }else{
           createPopUpNotificaton(json.msg, 'danger');
      }
      getcdescount++;
  });
}

// Company Designation > add designation
$("#add-designation-frm").submit(function(e){
    e.preventDefault();
    var err = 0;
    var request_data = {};
    request_data.data = {};
    request_data.url = path+'company/designation/add_designation';
    request_data.data.designation_name = $.trim($("#designation_name").val());
    request_data.data.designation_desc = $.trim($("#designation_desc").val());
    request_data.data._token = $.cookie('_token_cookie');
    request_data.data.jwt = $.cookie('jwt');
    if(request_data.data.designation_name.length == 0){
        $("#designation_name").parent().addClass("has-error");
        $("#designation_name").next().remove();
        $("#designation_name").after("<small class='text-danger err'>Designation Name is missing.</small>");
        err++;
    } else {
        $("#designation_name").parent().removeClass("has-error");
        $("#designation_name").next().remove();
    }
    if(!err){
      $(".add-designation-modal-msg").empty();
      form_btn_spinner_show("#add-designation-frm");
      process_post_request(request_data, function(json){
          if(json.success){
              if(json.status == 200){
                  form_btn_spinner_hide("#add-designation-frm", "Add Designation")
                  closeModelAndRest("#add-designation-frm");
                  createPopUpNotificaton(json.msg, 'success');
                  getDesignation();
              }else{
                  if(json.msg=='Designation name already exists'){
                      form_btn_spinner_hide("#add-designation-frm", "Add Designation")
                      $("#designation_name").parent().addClass("has-error");
                      $("#designation_name").next().remove();
                      $("#designation_name").after("<small class='text-danger err'>"+json.msg+"</small>");
                      err++;
                  } else {
                      form_btn_spinner_hide("#add-designation-frm", "Add Designation")
                      closeModelAndRest("#add-designation-frm");
                      createPopUpNotificaton(json.msg, 'danger');
                  }
              }
          }else{
              form_btn_spinner_hide("#add-designation-frm", "Add Designation")
              closeModelAndRest("#add-designation-frm");
              createPopUpNotificaton(json.msg, 'danger');
          }
      });
    }
});

// Company Designation > edit designation
$("#edit-designation-frm").submit(function(e){
    e.preventDefault();
    var err = 0;
    var request_data = {};
    request_data.data = {};
    request_data.url = path+'company/designation/edit_designation';
    request_data.data.id = $.trim($("#edit_designation_id").val());
    request_data.data.designation_name = $.trim($("#edit_designation_name").val());
    request_data.data.designation_desc = $.trim($("#edit_designation_desc").val());
    request_data.data._token = $.cookie('_token_cookie');
    request_data.data.jwt = $.cookie('jwt');
    if(request_data.data.designation_name.length == 0){
        $("#edit_designation_name").parent().addClass("has-error");
        $("#edit_designation_name").next().remove();
        $("#edit_designation_name").after("<small class='text-danger err'>Designation Name is missing.</small>");
        err++;
    } else {
        $("#edit_designation_name").parent().removeClass("has-error");
        $("#edit_designation_name").next().remove();
    }
    if(!err){
      $(".edit-designation-modal-msg").empty();
      form_btn_spinner_show("#edit-designation-frm");
      process_post_request(request_data, function(json){
          if(json.success){
              if(json.status == 200){
                  form_btn_spinner_hide("#edit-designation-frm", "Update Designation")
                  closeModelAndRest("#edit-designation-frm");
                  createPopUpNotificaton(json.msg, 'success');
                  getDesignation();
              }else{
                   if(json.msg=='Designation name already exists'){
                      form_btn_spinner_hide("#edit-designation-frm", "Update Designation")
                      $("#edit_designation_name").parent().addClass("has-error");
                      $("#edit_designation_name").next().remove();
                      $("#edit_designation_name").after("<small class='text-danger err'>"+json.msg+"</small>");
                      err++;
                  } else {
                      form_btn_spinner_hide("#edit-designation-frm", "Update Designation")
                      closeModelAndRest("#edit-designation-frm");
                      createPopUpNotificaton(json.msg, 'danger');
                  }
              }
          }else{
              form_btn_spinner_hide("#edit-designation-frm", "Update Designation")
              closeModelAndRest("#edit-designation-frm");
              createPopUpNotificaton(json.msg, 'danger');
          }
      });
    }
});


// Company Associate > get associate list
var getcascount=0;
function getAssociate(){
  var request_data = {};
  request_data.data = {};
  request_data.url = path+'company/associate/get_associates';
  request_data.data._token = $.cookie('_token_cookie');
  request_data.data.jwt = $.cookie('jwt');
  process_post_request(request_data, function(json){
      if(json.success){
          if(json.status == 200){
                var str='';
                $.each(json.list, function(key, val){
                    str += `<tr>
                           <td>${val.id}</td>
                           <td>${val.profile_pic}</td>
                           <td>{ "name": "${val.name}",  "mobile_no": "${val.mobile}", "email": "${val.email}", "level":"${val.level}" }</td>
                           <td>{ "department": "${val.dept_id}", "designation": "${val.designation_id}" }</td>
                           <td>{ "paddr": "${val.paddr}", "caddr": "${val.caddr}" }</td>
                           <td>{ "emergency_person": "${val.emergency_person}", "emergency_contact": "${val.emergency_contact}" }</td>
                           <td>{ "is_active" : "${val.is_active}", "is_deleted" : "${val.is_delete}", "is_donor" : "${val.is_donor}" }</td>
                           </tr>`;
                });
                $('#c-as-datatable-body').html(str);
                if(!getcascount){
                  //Command Buttons
                  $("#c-as-datatable").bootgrid({
                      css: {
                          icon: 'zmdi icon',
                          iconColumns: 'zmdi-view-module',
                          iconDown: 'zmdi-expand-more',
                          iconRefresh: 'zmdi-refresh',
                          iconUp: 'zmdi-expand-less'
                      },
                      formatters: {
                          "pc_img": function(column, row)
                          {
                              row.profile_pic.length > 31 ? str = `<div class="associate-profile-table"><img src="/${row.profile_pic}" alt="associate_pic"></div>` : str = `<div class="image_missing text-uppercase">${row.profile_pic}</div>`;
                              return str;
                          },
                          "a_info": function(column, row)
                          {
                              str = JSON.parse(row.associate_info);
                              return `<span style='font-size:13px;'>Name : </span><br/><strong style='font-size:14px;'>${str.name}</strong></span><br/>
                                      <span style='font-size:13px;'>Mobile no : </span><br/><strong style='font-size:14px;'>${str.mobile_no}</strong></span><br/>
                                      <span style='font-size:13px;'>Email : </span><br/><strong style='font-size:14px;'>${str.email}</strong></span><br/>
                                      <span style='font-size:13px;'>Level : </span><br/><strong style='font-size:14px;'>${str.level}</strong></span>`;
                          },
                          "asd_info": function(column, row)
                          {
                              str = JSON.parse(row.department_designation);
                              return `<span style='font-size:13px;'>Department : </span><br/><strong style='font-size:14px;'>${str.department}</strong><br/>
                                     <span style='font-size:13px;'>Designation : </span><br/><strong style='font-size:14px;'>${str.designation}</strong>`;
                          },
                           "ad_info": function(column, row)
                          {
                              str = JSON.parse(row.address.replace(/\n/g,'\\n').replace(/\r/g,'\\r'));
                              return `<span style='font-size:13px;'>Permanent Address:</span><br/><strong style='font-size:14px;'>${str.paddr}</strong><br/>
                                     <span style='font-size:13px;'>Correspondence Address : </span><br/><strong style='font-size:14px;'>${str.caddr}</strong>`;
                          },
                          "em_info": function(column, row)
                          {
                              str = JSON.parse(row.emergency_info);
                              return `<span style='font-size:13px;'>Name : </span><br/><strong style='font-size:14px;'>${str.emergency_person}</strong><br/> <span style='font-size:13px;'>Mobile no : </span><br/><strong style='font-size:14px;'>${str.emergency_contact}</strong>`;
                          },
                          "astatus" : function (column, row){
                              str = JSON.parse(row.astatus);
                             return `Is Active <br><strong> ${ str.is_active == 1 ? 'YES' : 'NO' } </strong><br>Is Deleted <br><strong> ${ str.is_deleted == 1 ? 'YES' : 'NO' } </strong><br>Is Donor <br><strong> ${ str.is_donor == 1 ? 'YES' : 'NO' } </strong>`;
                          },
                          "commands": function(column, row) {
                              return `<button type="button" title="View Associate Info" onclick="viewAssociate(${row.id}); return false;" class="btn btn-default waves-effect" data-row-id="${row.id}"><i class="zmdi zmdi-eye"></i></button> <button type="button" title="Edit Associate Info" onclick="editAssociate(${row.id}); return false;" class="btn btn-default waves-effect" data-row-id="${row.id}"><i class="zmdi zmdi-edit"></i></button> <button type="button" title="Restore/Delete Associate" onclick="deleteAssociate(${row.id}); return false;" class="btn btn-default waves-effect" data-row-id="${row.id}"><i class="zmdi zmdi-delete"></i></button> <button type="button" title="Activate/Deactivate Associate" onclick="isactivateAssociate(${row.id}); return false;" class="btn btn-default waves-effect" data-row-id="${row.id}"><i class="zmdi zmdi-block"></i></button> <button type="button" title="Regenerate Associate Password" onclick="repassAssociate(${row.id}); return false;" class="btn btn-default waves-effect" data-row-id="${row.id}"><i class="zmdi zmdi-key"></i></button>`;
                          }
                      }
                  });
                } else {
                  $("#c-as-datatable").bootgrid('destroy');
                  $('#c-as-datatable-body').html(str);
                  //Command Buttons
                  $("#c-as-datatable").bootgrid({
                      css: {
                          icon: 'zmdi icon',
                          iconColumns: 'zmdi-view-module',
                          iconDown: 'zmdi-expand-more',
                          iconRefresh: 'zmdi-refresh',
                          iconUp: 'zmdi-expand-less'
                      },
                      formatters: {
                          "pc_img": function(column, row)
                          {
                              row.profile_pic.length > 31 ? str = `<div class="associate-profile-table"><img src="/${row.profile_pic}" alt="associate_pic"></div>` : str = `<div class="image_missing text-uppercase">${row.profile_pic}</div>`;
                              return str;
                          },
                          "a_info": function(column, row)
                          {
                              str = JSON.parse(row.associate_info);
                              return `<span style='font-size:13px;'>Name : </span><br/><strong style='font-size:14px;'>${str.name}</strong></span><br/>
                                      <span style='font-size:13px;'>Mobile no : </span><br/><strong style='font-size:14px;'>${str.mobile_no}</strong></span><br/>
                                      <span style='font-size:13px;'>Email : </span><br/><strong style='font-size:14px;'>${str.email}</strong></span><br/>
                                      <span style='font-size:13px;'>Level : </span><br/><strong style='font-size:14px;'>${str.level}</strong></span>`;
                          },
                          "asd_info": function(column, row)
                          {
                              str = JSON.parse(row.department_designation);
                              return `<span style='font-size:13px;'>Department : </span><br/><strong style='font-size:14px;'>${str.department}</strong><br/>
                                     <span style='font-size:13px;'>Designation : </span><br/><strong style='font-size:14px;'>${str.designation}</strong>`;
                          },
                           "ad_info": function(column, row)
                          {
                              str = JSON.parse(row.address.replace(/\n/g,'\\n').replace(/\r/g,'\\r'));
                              return `<span style='font-size:13px;'>Permanent Address:</span><br/><strong style='font-size:14px;'>${str.paddr}</strong><br/>
                                     <span style='font-size:13px;'>Correspondence Address : </span><br/><strong style='font-size:14px;'>${str.caddr}</strong>`;
                          },
                          "em_info": function(column, row)
                          {
                              str = JSON.parse(row.emergency_info);
                              return `<span style='font-size:13px;'>Name : </span><br/><strong style='font-size:14px;'>${str.emergency_person}</strong><br/> <span style='font-size:13px;'>Mobile no : </span><br/><strong style='font-size:14px;'>${str.emergency_contact}</strong>`;
                          },
                          "astatus" : function (column, row){
                             str = JSON.parse(row.astatus);
                             return `Is Active <br><strong> ${ str.is_active == 1 ? 'YES' : 'NO' } </strong><br>Is Deleted <br><strong> ${ str.is_deleted == 1 ? 'YES' : 'NO' } </strong><br>Is Donor <br><strong> ${ str.is_donor == 1 ? 'YES' : 'NO' } </strong>`;
                          },
                          "commands": function(column, row) {
                              return `<button type="button" title="View Associate Info" onclick="viewAssociate(${row.id}); return false;" class="btn btn-default waves-effect" data-row-id="${row.id}"><i class="zmdi zmdi-eye"></i></button> <button type="button" title="Edit Associate Info" onclick="editAssociate(${row.id}); return false;" class="btn btn-default waves-effect" data-row-id="${row.id}"><i class="zmdi zmdi-edit"></i></button> <button type="button" title="Restore/Delete Associate" onclick="deleteAssociate(${row.id}); return false;" class="btn btn-default waves-effect" data-row-id="${row.id}"><i class="zmdi zmdi-delete"></i></button> <button type="button" title="Activate/Deactivate Associate" onclick="isactivateAssociate(${row.id}); return false;" class="btn btn-default waves-effect" data-row-id="${row.id}"><i class="zmdi zmdi-block"></i></button> <button type="button" title="Regenerate Associate Password" onclick="repassAssociate(${row.id}); return false;" class="btn btn-default waves-effect" data-row-id="${row.id}"><i class="zmdi zmdi-key"></i></button>`;
                          }
                      }
                  });
                }
          }else{
              if(!json.list){
                str += `<tr>
                        <td colspan="8" class="text-center">No Record Found!</td>
                        </tr>`;
              }
              $('#c-as-datatable-body').html(str);
              createPopUpNotificaton(json.msg, 'danger');
          }
      }else{
           createPopUpNotificaton(json.msg, 'danger');
      }
      getcascount++;
  });
}

function validateFormData(inpuData, inputId, inputName){
  $(inputId).parent().removeClass("has-error");
  $(inputId).next().remove();

  // if email is invalid
  if(inputName=='Email'){
    if (!/(.+)@(.+){2,}\.(.+){2,}/.test(inpuData)) {
    $(inputId).parent().addClass("has-error");
    $(inputId).next().remove();
    $(inputId).after(`<small class='text-danger'>Invalid ${inputName} address.</small>`);
       return 1;
    }
  }

  // if mobile_no is invalid
  if(inputName=='Mobile No.'){
    if (!/^[6-9][0-9]{9}$/.test(inpuData)) {
    $(inputId).parent().addClass("has-error");
    $(inputId).next().remove();
    $(inputId).after(`<small class='text-danger'>Invalid ${inputName}</small>`);
       return 1;
    }
  }

  if(inpuData!==null){
    // if input is empty
    if(inpuData.length == 0){
      $(inputId).parent().addClass("has-error");
      $(inputId).next().remove();
      $(inputId).after(`<small class='text-danger'>${inputName} is missing.</small>`);
       return 1;
    } else {
      $(inputId).parent().removeClass("has-error");
      $(inputId).next().remove();
      return 0;
    }
  } else {
    // if dropdown is empty
    $(inputId).parent().addClass("has-error");
    $(inputId).next().remove();
    $(inputId).after(`<small class='text-danger'>${inputName} is missing.</small>`);
    return 0;
  }
}

// Company Associate > create new messenger account
// Company Associate > create new messenger account
// function createMessengerAccount(associate_id, email, name){
//   var formData = new FormData();
//   //formData.append('profile_pic', profile_pic);
//   formData.append('userEmail', email);
//   formData.append('userPassword', email);
//   formData.append('firstName', name);
//   formData.append('userType', '1');
//   formData.append('userID', associate_id);
//   $.ajax({
//       "url": path+"messenger/registration/register/",
//       "method": "POST",
//       "headers": {
//           "authorization": "Basic YWRtaW46MTIzNA==",
//           "cache-control": "no-cache"
//       },
//       "processData": false,
//       "contentType": false,
//       "mimeType": "multipart/form-data",
//       "data": formData,
//       "success":function (response) {
//           var data=JSON.parse(response);
//           if(data.status.code==200 && data.status.message=="Success")
//           {
//               // console.log("yes");
//           }
//       },
//       "statusCode": {
//           404: function(error) {
//               console.log(error);
//           },
//           406: function (error) {
//               console.log(error);
//           }
//       }
//   });
// }

// Company Associate > add associate
$("#add-associate-frm").submit(function(e){
    e.preventDefault();
    var err=0;
    var is_su_user=0;
    err += validateFormData($.trim($("#fullname").val()), "#fullname", "Name");
    err += validateFormData($.trim($("#email").val()), "#email", "Email");
    err += validateFormData($.trim($("#mobile").val()), "#mobile", "Mobile No.");
    err += validateFormData($("#blood_group").val(), "#blood_group", "Blood Group");
    err += validateFormData($("#department").val(), "#department", "Department");
    err += validateFormData($("#designation").val(), "#designation", "Designation");
    err += validateFormData($.trim($("#paddr").val()), "#paddr", "Permanent Address");
    err += validateFormData($.trim($("#pan").val()), "#pan", "PAN No.");
    err += validateFormData($.trim($("#aadhar").val()), "#aadhar", "Aadhar No.");
    err += validateFormData($.trim($("#emergency_person").val()), "#emergency_person", "Name");
    err += validateFormData($.trim($("#emergency_contact").val()), "#emergency_contact", "Mobile No.");
    if($('#has_many_pro').val()){
      $('#has_many_pro').val(1);
    } else {
      $('#has_many_pro').val(0);
    }
    if($('#is_su_user').prop('checked')){
      is_su_user = 1;
    } else {
      is_su_user = 0;
    }
    if(!err){
        form_btn_spinner_show("#add-associate-frm");
        var profile_pic = $('#profile_pic')[0].files[0];
        var formData = new FormData();
        formData.append('profile_pic', profile_pic);
        formData.append('_token', $.cookie("_token_cookie"));
        formData.append('jwt', $.cookie("jwt"));
        formData.append('name', $.trim($("#fullname").val()));
        formData.append('email', $.trim($("#email").val()));
        formData.append('mobile', $.trim($("#mobile").val()));
        formData.append('blood_group', $("#blood_group").val());
        formData.append('department', $("#department").val());
        formData.append('designation', $("#designation").val());
        formData.append('dob', $.trim($("#dob").val()));
        formData.append('gender', $('input[name=gender]:checked').val());
        formData.append('level', $("#level").val());
        formData.append('paddr', $.trim($("#paddr").val()));
        formData.append('caddr', $.trim($("#caddr").val()));
        formData.append('pan', $.trim($("#pan").val()));
        formData.append('aadhar', $.trim($("#aadhar").val()));
        formData.append('has_many_pro', $.trim($('#has_many_pro').val()));
        formData.append('emergency_person', $.trim($("#emergency_person").val()));
        formData.append('emergency_contact', $.trim($("#emergency_contact").val()));
        formData.append('is_super_user', $.trim(is_su_user));
        // formData.forEach((value,key) => {
        //       console.log(key+" "+value)
        // });
        $.ajax({
          url: path+'company/associate/add_associate',
          method: "POST",
          data: formData,
          contentType: false,
          cache: false,
          processData: false,
          success: function(data){
            json = JSON.parse(data);
            if(json.status == 200){
                form_btn_spinner_hide("#add-associate-frm", "Add Associate");
                // if($('#has_many_pro').val()==0){
                //   createMessengerAccount($.trim(json.associate_id),$.trim($("#email").val()),$.trim($("#fullname").val()));
                // }
                closeModelAndRest("#add-associate-frm");
                createPopUpNotificaton(json.msg, 'success');
                getAssociate();
            }else{
                form_btn_spinner_hide("#add-associate-frm", "Add Associate");
                if(json.field){
                  $(`#${json.field}`).parent().addClass("has-error");
                  $(`#${json.field}`).next().remove();
                  $(`#${json.field}`).after("<small class='text-danger err'>"+json.msg+"</small>");
                } else {
                  closeModelAndRest("#add-associate-frm");
                  createPopUpNotificaton(json.msg, 'danger');
                }
            }
          },
          error: function(data){
            json = JSON.parse(data);
            form_btn_spinner_hide("#add-associate-frm", "Add Associate");
            closeModelAndRest("#add-associate-frm");
            createPopUpNotificaton(json.msg, 'danger');
          }
        });
    }
})

// Company Associate > edit associate
$("#edit-associate-frm").submit(function(e){
    e.preventDefault();
    var err=0;
    var is_su_user=0;
    err += validateFormData($.trim($("#e_fullname").val()), "#e_fullname", "Name");
    err += validateFormData($.trim($("#e_email").val()), "#e_email", "Email");
    err += validateFormData($.trim($("#e_mobile").val()), "#e_mobile", "Mobile No.");
    err += validateFormData($("#e_blood_group").val(), "#e_blood_group", "Blood Group");
    err += validateFormData($("#e_department").val(), "#e_department", "Department");
    err += validateFormData($("#e_designation").val(), "#e_designation", "Designation");
    err += validateFormData($.trim($("#e_paddr").val()), "#e_paddr", "Permanent Address");
    err += validateFormData($.trim($("#e_pan").val()), "#e_pan", "PAN No.");
    err += validateFormData($.trim($("#e_aadhar").val()), "#e_aadhar", "Aadhar No.");
    err += validateFormData($.trim($("#e_emergency_person").val()), "#e_emergency_person", "Name");
    err += validateFormData($.trim($("#e_emergency_contact").val()), "#e_emergency_contact", "Mobile No.");
    if($('#e_is_su_user').prop('checked')){
      is_su_user = 1;
    } else {
      is_su_user = 0;
    }
    if(!err){
        form_btn_spinner_show("#edit-associate-frm");
        var profile_pic = $('#e_profile_pic')[0].files[0];
        var formData = new FormData();
        formData.append('id', $("#edit_associate_id").val());
        formData.append('profile_pic', profile_pic);
        formData.append('_token', $.cookie("_token_cookie"));
        formData.append('jwt', $.cookie("jwt"));
        formData.append('name', $.trim($("#e_fullname").val()));
        formData.append('email', $.trim($("#e_email").val()));
        formData.append('mobile', $.trim($("#e_mobile").val()));
        formData.append('blood_group', $("#e_blood_group").val());
        formData.append('department', $("#e_department").val());
        formData.append('designation', $("#e_designation").val());
        formData.append('dob', $.trim($("#e_dob").val()));
        formData.append('gender', $('input[name=e_gender]:checked').val());
        formData.append('level', $("#e_level").val());
        formData.append('paddr', $.trim($("#e_paddr").val()));
        formData.append('caddr', $.trim($("#e_caddr").val()));
        formData.append('pan', $.trim($("#e_pan").val()));
        formData.append('aadhar', $.trim($("#e_aadhar").val()));
        formData.append('emergency_person', $.trim($("#e_emergency_person").val()));
        formData.append('emergency_contact', $.trim($("#e_emergency_contact").val()));
        formData.append('is_super_user', $.trim(is_su_user));
        // formData.forEach((value,key) => {
        //    console.log(key+" "+value)
        // });
        $.ajax({
          url: path+'company/associate/edit_associate',
          method: "POST",
          data: formData,
          contentType: false,
          cache: false,
          processData: false,
          success: function(data){
            json = JSON.parse(data);
            if(json.status == 200){
                form_btn_spinner_hide("#edit-associate-frm", "Update Associate");
                closeModelAndRest("#edit-associate-frm");
                createPopUpNotificaton(json.msg, 'success');
                getAssociate();
            }else{
                form_btn_spinner_hide("#edit-associate-frm", "Update Associate");
                if(json.field){
                  $(`#${json.field}`).parent().addClass("has-error");
                  $(`#${json.field}`).next().remove();
                  $(`#${json.field}`).after("<small class='text-danger err'>"+json.msg+"</small>");
                } else {
                  closeModelAndRest("#edit-associate-frm");
                  createPopUpNotificaton(json.msg, 'danger');
                }
            }
          },
          error: function(data){
            json = JSON.parse(data);
            form_btn_spinner_hide("#edit-associate-frm", "Update Associate");
            closeModelAndRest("#edit-associate-frm");
            createPopUpNotificaton(json.msg, 'danger');
          }
        });
    }
})

// Company Associate > import associates
$("#upload-excel-file-frm").submit(function(e){
    e.preventDefault();
    form_btn_spinner_show("#upload-excel-file-frm");
    var excel = $('#excel')[0].files[0];
    var formData = new FormData();
    formData.append('excel', excel);
    formData.append('_token', $.cookie("_token_cookie"));
    formData.append('jwt', $.cookie("jwt"));
    $.ajax({
          url: path+'company/associate/bulk_import_associates',
          method: "POST",
          data: formData,
          contentType: false,
          cache: false,
          processData: false,
          success: function(data){
            json = JSON.parse(data);
            if(json.status == 200){
                form_btn_spinner_hide("#upload-excel-file-frm", "<i class='zmdi zmdi-upload zmdi-hc-fw'></i> <span>IMPORT</span>");
                closeModelAndRest("#upload-excel-file-frm");
                createPopUpNotificaton(json.msg, 'success');
                getAssociate();
            }else{
                form_btn_spinner_hide("#upload-excel-file-frm", "<i class='zmdi zmdi-upload zmdi-hc-fw'></i> <span>IMPORT</span>");
                if(json.field){
                  $(`#${json.field}`).parent().addClass("has-error");
                  $(`#${json.field}`).next().remove();
                  $(`#${json.field}`).after("<small class='text-danger err'>"+json.msg+"</small>");
                } else {
                  closeModelAndRest("#add-associate-frm");
                  createPopUpNotificaton(json.msg, 'danger');
                }
            }
          },
          error: function(data){
            // console.log(data);
            json = JSON.parse(data);
            form_btn_spinner_hide("#upload-excel-file-frm", "<i class='zmdi zmdi-upload zmdi-hc-fw'></i> <span>IMPORT</span>");
            closeModelAndRest("#upload-excel-file-frm");
            createPopUpNotificaton(json.msg, 'danger');
          }
        });
})

// Company profile > get company info
function getCompany(){
  var request_data = {};
  request_data.data = {};
  request_data.url = path+'company/profile/get_company_info';
  request_data.data._token = $.cookie('_token_cookie');
  request_data.data.jwt = $.cookie('jwt');
  var pr_pic = '';
  process_post_request(request_data, function(json){
      if(json.success){
          if(json.status == 200){
            $(".cp_profile_pic").html('');
            $(".add-sec").html('');
            $(".cp_csname").html(json.list[0].company_name+' <small> Subscribed Date : '+json.list[0].subscribed_date+'</small>');
            if(json.list[0].profile_pic.length > 20){
              $(".cp_profile_pic").html('<img class="img-responsive" src="/'+json.list[0].profile_pic+'" alt="">')
            } else {
              if(json.list[0].profile_pic.length > 4 && json.list[0].profile_pic.length < 10){
                  pr_pic = json.list[0].profile_pic.substring(0,4)+'..';
              } else {
                pr_pic = json.list[0].profile_pic;
              }
              $(".cp_profile_pic").html('<div class="company_profile_image">'+pr_pic.toUpperCase()+'</div>');
            }
            var cp_address='<div class="pmo-block pmo-contact hidden-xs"><h2>Address</h2><ul><i class="zmdi zmdi-pin"></i><address class="m-b-0 ng-binding"><span class="cp_address">';
            cp_address += json.list[0].street_line_1 ? json.list[0].street_line_1+',' : '';
            cp_address += json.list[0].street_line_2 ? json.list[0].street_line_2+',' : '';
            cp_address += json.list[0].street_line_3 ? json.list[0].street_line_3+',<br>' : '';
            cp_address += json.list[0].city ? json.list[0].city+',<br>' : '';
            cp_address += json.list[0].pin ? json.list[0].pin+',<br>' : '';
            cp_address += json.list[0].state ? json.list[0].state+',<br>' : '';
            cp_address += '</span></address></li></ul></div>';
            if(json.list[0].state || json.list[0].pin || json.list[0].city){
              $(".add-sec").html(cp_address);
            } else {
              $(".add-sec").html();
            }
            $(".cp_cname").text(json.list[0].company_name.toUpperCase());
            $(".cp_subscription_date").text(json.list[0].subscribed_date);
            var cp_account_type=JSON.parse(json.list[0].account_type);
            var cp_ac_type = '';
            cp_account_type.forEach(row => {
                  cp_ac_type+=row+',';
            })
            $(".cp_account_type").text(cp_ac_type.substring(0, cp_ac_type.length - 1));
            $(".cp_status").text(json.list[0].is_active ? 'ACTIVE' : 'INACTIVE');
            $(".cp_email").text(json.list[0].email);
            $(".cp_mobile").text(json.list[0].contact_no);
          }else{
            createPopUpNotificaton(json.msg, 'danger');
          }
      }else{
           createPopUpNotificaton(json.msg, 'danger');
      }
  });
}

// Company profile > edit company
$("#edit-company-frm").submit(function(e){
    e.preventDefault();
    var err=0;
    err += validateFormData($.trim($("#e_cname").val()), "#e_fullname", "Name");
    err += validateFormData($.trim($("#e_email").val()), "#e_email", "Email");
    err += validateFormData($.trim($("#e_mobile").val()), "#e_mobile", "Mobile No.");
    err += validateFormData($("#e_alt_mobile").val(), "#e_alt_mobile", "Mobile No.");
    var eAccountType = "[";
    var informix = $('#informix').is(":checked") ? eAccountType+='"informix"' : false;
    var crm = $('#crm').is(":checked") ? eAccountType+='"crm"' : false;
    var erp = $('#erp').is(":checked") ? eAccountType+='"erp"' : false;
    eAccountType+=']';
    eAccountType = eAccountType.replace(/""/g, `","`);
    if(eAccountType.length<3){
      $(`#e_account_type`).parent().addClass("has-error");
      $(`#e_account_type`).next().remove();
      $(`#e_account_type`).after("<small class='text-danger err'>Please select at least one option</small>");
      err++;
    } else {
      $("#e_account_type_err").attr('class', 'col-md-4');
      $(`#e_account_type`).next().remove();
    }

    if(!err){
        form_btn_spinner_show("#edit-company-frm");
        var profile_pic = $('#e_profile_pic')[0].files[0];
        var formData = new FormData();
        formData.append('id', $("#edit_company_id").val());
        formData.append('profile_pic', profile_pic);
        formData.append('_token', $.cookie("_token_cookie"));
        formData.append('jwt', $.cookie("jwt"));
        formData.append('company_name', $.trim($("#e_cname").val()));
        formData.append('email', $.trim($("#e_email").val()));
        formData.append('contact_no', $.trim($("#e_mobile").val()));
        formData.append('alt_contact', $("#e_alt_mobile").val());
        formData.append('govt_id_1', $.trim($("#e_govtid_1").val()));
        formData.append('govt_id_2', $.trim($("#e_govtid_2").val()));
        formData.append('govt_id_3', $.trim($("#e_govtid_3").val()));
        formData.append('account_type', eAccountType);
        formData.append('street_line_1', $.trim($("#e_street_1").val()));
        formData.append('street_line_2', $.trim($("#e_street_2").val()));
        formData.append('street_line_3', $.trim($("#e_street_3").val()));
        formData.append('pin', $.trim($("#e_pin").val()));
        formData.append('city', $.trim($("#e_city").val()));
        formData.append('state', $.trim($("#e_state").val()));
        $.ajax({
          url: path+'company/profile/edit_company',
          method: "POST",
          data: formData,
          contentType: false,
          cache: false,
          processData: false,
          success: function(data){
            json = JSON.parse(data);
            if(json.status == 200){
                form_btn_spinner_hide("#edit-company-frm", "Update Company Info");
                closeModelAndRest("#edit-company-frm");
                createPopUpNotificaton(json.msg, 'success');
                getCompany();
            }else{
                form_btn_spinner_hide("#edit-company-frm", "Update Company Info");
                if(json.field){
                  $(`#${json.field}`).parent().addClass("has-error");
                  $(`#${json.field}`).next().remove();
                  $(`#${json.field}`).after("<small class='text-danger err'>"+json.msg+"</small>");
                } else {
                  closeModelAndRest("#edit-company-frm");
                  createPopUpNotificaton(json.msg, 'danger');
                }
            }
          },
          error: function(data){
            // console.log(data);
            json = JSON.parse(data);
            form_btn_spinner_hide("#edit-company-frm", "Update Company Info");
            closeModelAndRest("#edit-company-frm");
            createPopUpNotificaton(json.msg, 'danger');
          }
        });
    }
})

// Notification popup
function notify(from, align, icon, type, animIn, animOut, msg){
    $.growl({
        icon: icon,
        title: '',
        message: msg,
        url: ''
    },{
        element: 'body',
        type: type,
        allow_dismiss: true,
        placement: {
            from: from,
            align: align
        },
        offset: {
            x: 30,
            y: 30
        },
        spacing: 10,
        z_index: 1031,
        delay: 3000,
        timer: 1000,
        url_target: '_blank',
        mouse_over: false,
        animate: {
            enter: animIn,
            exit: animOut
        },
        icon_type: 'class',
        template: '<div data-growl="container" class="alert" role="alert">' +
        '<button type="button" class="close" data-growl="dismiss">' +
        '<span aria-hidden="true">&times;</span>' +
        '<span class="sr-only">Close</span>' +
        '</button>' +
        '<span data-growl="icon"></span>' +
        '<span data-growl="title"></span>' +
        '<span data-growl="message"></span>' +
        '<a href="#" data-growl="url"></a>' +
        '</div>'
    });
};

function createPopUpNotificaton(msg,dataType){
    var nFrom = $(this).attr('data-from');
    var nAlign = $(this).attr('data-align');
    var nIcons = $(this).attr('data-icon');
    var nType = dataType;
    var nAnimIn = $(this).attr('data-animation-in');
    var nAnimOut = $(this).attr('data-animation-out');

    notify(nFrom, nAlign, nIcons, nType, nAnimIn, nAnimOut, msg);
};

function closeModelAndRest(formdes){
  $('.modal').modal('hide');
  $('.has-error').removeClass('has-error');
  $("small.text-danger").detach();
  switch(formdes){
    case '#add-associate-frm' : document.getElementById('all-image-filereset').click();
                                $("input[type=text]").val("");
                                $("textarea").val("");
                                $('input:radio[name=gender][value=M]').click();
                                $('select').prop('selectedIndex',0);
                                 break;
    case '#edit-associate-frm' : document.getElementById('all-image-filereset1').click();
                                  break;
    case '#upload-excel-file-frm' : document.getElementById('all-filereset3').click();
                                  break;
    case '#edit-company-frm' : document.getElementById('all-filereset4').click();
                                  break;
    case '#add-project-frm' : $("#p-a-associates").val('');
                              $("#p-a-associates").trigger("chosen:updated");
                              document.getElementById('all-image-filereset').click();
                              $("input[type=text]").val("");
                              $("textarea").val("");
                              $('select').prop('selectedIndex',0);
                              break;
    case '#manage-project-modal' : $("#p-a-associates").text('');
                                   $("#p-a-associates").trigger("chosen:updated");
                                   $(".text-danger").remove();
                                    break;
    case '#add-task-frm' :  $("#t-a-associates").val('');
                            $("#t-a-associates").trigger("chosen:updated");
                            $("#task_attachments").val(null);
                            $("input[type=text]").val("");
                            $("input[type=checkbox]").prop("checked", false);
                            $("#repeat_fre").css('display','none');
                            $("textarea").val("");
                            $('select').prop('selectedIndex',0);
                            break;
    default: $(formdes)[0].reset();
             break;
  }
}
