let timer = Date.now();
document.addEventListener(
  "keydown",
  (event) => {
    if (window.location.pathname == "/Dashboard") {
      return;
    }
    timer = Date.now();
  },
  false
);

document.addEventListener(
  "mousemove",
  (event) => {
    if (window.location.pathname == "/Dashboard") {
      return;
    }
    timer = Date.now();
  },
  false
);

setInterval(function () {
  if (window.location.pathname == "/Dashboard") {
    return;
  }
  let t = Date.now() - timer;
  let time_idle = 8;
  let time_remain = 5;

  if (t > time_idle * 1000) {
    let time_second = time_remain + time_idle - t / 1000;
    time_second = Math.floor(time_second);
    $("#countdown").html(time_second);
  } else {
    $("#countdown").html("&nbsp;");
  }

  if (t > (time_idle + time_remain) * 1000) {
    logout();
  }
}, 1000);

//logout
let logout = () => {
  let data = [];
  $("input").each(function () {
    if ($(this).attr("name") && $(this).val()) {
      if ($(this).attr("type") == "checkbox") {
        data.push({ [$(this).attr("name")]: $(this).is("checked") });
      } else {
        data.push({ [$(this).attr("name")]: $(this).val() });
      }
    }
  });
  $("select").each(function () {
    let selected_value = $(this).children("option:selected").val();
    let name = $(this).attr("name");
    data.push({ [name]: selected_value });
  });
  localStorage.setItem("data", JSON.stringify(data));
  localStorage.setItem("restore_path", window.location.pathname);
  localStorage.setItem("time", Date.now());
  localStorage.setItem("user_id", get_user_id());
  document.location = "/home/signout";
};

//restore data
$(document).ready(function () {
  let time = localStorage.getItem("time");
  let time_remove = 2; //hours
  time_remove *= 1000 * 60 * 60;
  if (Date.now() - time > time_remove) {
    localStorage.removeItem("data");
    localStorage.removeItem("restore_path");
    localStorage.removeItem("time");
    localStorage.removeItem("user_id");
    return;
  }

  let path = localStorage.getItem("restore_path");
  let user_id = localStorage.getItem("user_id");

  if (
    path &&
    user_id == get_user_id() &&
    window.location.pathname == "/Dashboard"
  ) {
    window.location = path;
    return;
  }

  if (window.location.pathname == "/Dashboard") {
    return;
  }

  let _data = localStorage.getItem("data");
  _data = JSON.parse(_data);
  if (_data && window.location.pathname == path) {
    if (confirm("Do want to restore?")) {
      $("input").each(function () {
        let input_form = this;
        _data.map((_d) => {
          if ($(input_form).attr("name") && _d[$(input_form).attr("name")]) {
            if ($(input_form).attr("type") == "checkbox") {
              $(input_form).prop("checked", _d[$(input_form).attr("name")]);
            } else {
              $(input_form).val(_d[$(input_form).attr("name")]);
            }
          }
        });
      });
      $("select").each(function () {
        let select_form = this;
        _data.map((_d) => {
          if ($(select_form).attr("name") && _d[$(select_form).attr("name")]) {
            $(`select[name="${$(select_form).attr("name")}"]`).val(
              _d[$(select_form).attr("name")]
            );
          }
        });
      });
    }
    //delete localStorage
    localStorage.removeItem("data");
    localStorage.removeItem("restore_path");
    localStorage.removeItem("time");
    localStorage.removeItem("user_id");
  }
});

let get_user_id = () => {
  let result = 0;
  $("input").each(function () {
    if ($(this).attr("name") == "user_id") {
      result = $(this).val();
    }
  });
  return result;
};
