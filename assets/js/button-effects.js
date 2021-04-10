// Button type='submit' Spinner Effect
function form_btn_spinner_show(frm){
  $(frm).find("button[type='submit']").attr('disabled', true).html("<i class='fa fa-spinner fa-spin' aria-hidden='true'></i> Please wait...");
}
function form_btn_spinner_hide(frm, label){
  $(frm).find("button[type='submit']").attr('disabled', false).html(label);
}

// Button type='button' Spinner Effect
function btn_spinner_show(btn){
  $(btn).attr('disabled', true).html("<i class='fa fa-spinner fa-spin' aria-hidden='true'></i> Please wait...");
}
function btn_spinner_hide(btn, label){
  $(btn).attr('disabled', false).html(label);
}

// link Button Spinner Effect
function link_btn_spinner_show(btn){
  $(btn).attr('disabled', true).html("<i class='fa fa-circle-o-notch fa-spin' aria-hidden='true'></i>");
}
function link_btn_spinner_hide(btn, label){
  $(btn).attr('disabled', false).html(label);
}

$(document).on("click", ".demo", function(e){
  link_btn_spinner_show($(this));
});

// overlay Effect
function overlay_spinner_show(container){
  $(container).html("<div class='overlay'><i class='fa fa-refresh fa-spin'></i></div>");
}
function overlay_spinner_hide(container){
  $(container).find(".overlay").remove();
}
