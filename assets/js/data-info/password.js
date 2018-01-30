var oldPassword;
var newPassword;

if(sessionStorage.manager == undefined ){
	window.location.replace("./../../login.html");
}

$(function(){

	str = sessionStorage.manager;
	obj = JSON.parse(str)
	var Id = obj.id;
	var master = obj.userName;
	$('#master').html(master);

	$('#passBtn').click(function(){
		newPassword = $('#newPass').val();
		data = {
			pwd: newPassword
	 	}
		$('#passForm').validate({
			submitHandler : function (form) {
				$(form).ajaxSubmit({
					type:'POST',
					url:IPAdress+'/admin/manager/putPassword/'+Id,
					data:data,
					dataType:'json',
					success:function(responseText,statusText){

						if(responseText.data == 1){
							$('#pass-box').hide();
							$('#success-remind').show();
						}
					},
					error:function(data){
					    alert(data.status);
					}
				});
			},
			rules : {
				newPass : {
					required : true,
				},
				newPassword : {
					required : true,
					equalTo: "#newPass"
				}
			},
			messages : {
				newPass : {
					required : '请输入密码！',
				},
				newPassword : {
					required : '请输入密码！',
					equalTo: '两次输入密码不一致！'
				}
			}
		});
	})
})