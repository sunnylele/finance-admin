var pageNum = 1;
var index;
var dataBox;
var adminName;
var selectBox;
var adminNmae;
var createTime;

if(sessionStorage.manager == undefined ){
	window.location.replace("./../../login.html");
}

//数据列表
function dataList(v){
	$(  '<tr>'
		+	'<td>'
		+		'<label>'
		+			'<input type="checkbox" class="ace" id="every" value="'+v.id+'"/>'
		+			'<span class="lbl"></span>'
		+		'</label>'
		+    '</td>'
		+	'<td>'+index+'</td>'
		+	'<td class="userNameColor">'+v.userName+'</td>'
		+	'<td>'+v.trueName+'</td>'
		+	'<td>'+v.phone+'</td>'
		+	'<td>'+toTime(v.createDate)+'</td>'
		+	'<td>'
		+		'<a class="pink" href="#" change-Id="'+v.id+'">'
		+			'<i class="icon-pencil"></i>'
		+		'</a>'
		+		'<a class="red" href="#" admin-Id="'+v.id+'">'
		+			'<i class="icon-trash bigger-130"></i>'
		+		'</a>'
		+	'</td>'
		+'</tr>').appendTo('#adminUser tbody');

	//判断状态是否正常
	if(v.status  == 0){
		// alert(v.status);
		$('#check_'+index).attr('checked',false);
	}else if(v.status == 1){
		// alert(v.status);
		$('#check_'+index).attr('checked',true);
	}
};

//数据渲染
function getData(){
	var adminName = $('#admin-name').val();
	var createTime = $('#create-time').val();
	data = {
		page:pageNum,
		userName:adminName,
		createDate: createTime
	}
	$.ajax({
		type:'GET',
		url:IPAdress+'/admin/manager/list',
		data:data,
		dataType:'json',
		cache:false,
		success:function(data){
			//console.log(data);
			dataBox = data.data;
			$('tbody').html('');
			$('#pages-box').html('');
			if(dataBox.list == 0){
				$('<tr><td colspan="7">暂无匹配数据</td></tr>').appendTo('tbody');
				return;
			}else{
				index=(dataBox.pageNum-1)*20;
				$.each(dataBox.list,function(i,v){
					index++;
					dataList(v);
	            });
	            rendPage(dataBox);
	            dataAdminUser = dataBox.list;
			};
		},
		error:function(data){
		    alert(data.status);
		}
	});
};


$(function(){

	str = sessionStorage.manager;
    obj = JSON.parse(str);
    var master = obj.userName;
    //console.log(master)

    $('#master').html(master);

	getData();

	//上一页
	$('#pages-box').on('click','li.prve',function(){
		pageNum = prePage;
		if(pageNum < 1){
			pageNum=1;
			return;
		}else{
			getData();
		}
	});

	//页码
	$('#pages-box').on('click','li.pageA',function(){
		if($(this).attr('id') == 'active_1'){
			thisNum=1;
		}else if($(this).attr('id') == 'active_'+totalPages){
			thisNum=totalPages;
		}else{
			thisNum = $(this).find('a').text();
		}
		pageNum = thisNum;
		getData();
	});

	//下一页
	$('#pages-box').on('click','li.next',function(){
		if(nextPage==0){
			pageNum=totalPages;
			return;
		}else{
			pageNum = nextPage;
		}
		getData();
	});

	//表单验证
	$.validator.addMethod('trueName',function(value,element){
		 var true_Name = /^[\u4e00-\u9fa5]{2,4}$/;
		 return this.optional(element) || (true_Name.test(value));
	},'请输入2到4位汉字');

	$.validator.addMethod('tel',function(value,element){
		 var phone = /^1[3|4|5|7|8][0-9]{9}$/;
		 return this.optional(element) || (phone.test(value));
	},'请输入正确的手机号码');


	//添加用户信息
	//选择角色
	$('.sel_productTag').select2({
        width:'688px'
    });
    $.ajax({
    	type:'GET',
		url:IPAdress+'/admin/manager/listRole',
		dataType:'json',
    	// data:$('#addAdminForm').serialize(),
		success:function(data){
			//console.log(data);
			selectBox = data.data.list;
			$.each(selectBox,function(i,v){
				$('<option value="'+v.id+'">'+v.roleName+'</option>').appendTo('.sel_productTag');
            });
		},
		error:function(data){
		    alert(data.status);
		}
    });
	$('.user-add').on('click',function(){
		$("#addDate-admin").modal('show');
		$(".modal-body :input").not('input[type = "submit" ]').val('');
		$('#add-admin').on('click',function(){
			var selectRole = $('.sel_productTag').val();
            $('#selectRoleName').val(selectRole);
			$('#addAdminForm').validate({
				submitHandler : function (form) {
					$.ajax({
						type:'POST',
						url:IPAdress+'/admin/manager/add',
						dataType:'json',
			        	data:$('#addAdminForm').serialize(),
						success:function(data){
							if(data.data == 1){
								getData();
								$("#addDate-admin").modal('hide');
							}else{
								layer.alert(data.message);
							};
						},
						error:function(data){
						    alert(data.status);
						}
					});
				},
				rules : {
					userName : {
						required : true,
					},
					trueName : {
						required : true,
						trueName : true,
					},
					password : {
						required : true,
					},
					truePassword : {
						required : true,
						equalTo: "#admin-pass"
					},
					phone : {
						required : true,
						tel : true,
					}
				},
				messages : {
					userName : {
						required : '请输入您的用户名！',
					},
					trueName : {
						required : '请输入您的姓名！',
					},
					password : {
						required : '请输入您的密码！',
					},
					truePassword : {
						required : '请再次输入您的密码！',
						equalTo: '两次输入密码不一致！'
					},
					phone : {
						required : '请输入您的电话！',
					}
				}
			});
		})
	});

	//单个删除
	$('tbody').on('click','.red',function(){
		var Id=$(this).attr("admin-Id");
        layer.confirm('你确定要删除此信息吗？', {
		  	btn: ['确定','取消']
		}, function(){
		  	$.ajax({
		     	type:'DELETE',
		        url:IPAdress+'/admin/manager/delete/'+Id,
		        cache:false,
		        dataType:'text',
		        success:function(data){
		         	getData();
		         	layer.msg('删除成功', {icon: 1});
		        },
		        error:function(data){
		        	alert(data.status);
		        }
	     	});
		}, function(){

		});
	});

	//批量删除
     $(".del-info").click(function() {
         // 判断是否至少选择一项
        var ids = getIds();
        if(null == ids || "" == ids || "undefined" == typeof ids) {
            layer.msg("请选择至少一项！",{
            	 time: 2000
            });
            return;
        };
        layer.confirm('你确定要删除所选信息吗？', {
		  	btn: ['确定','取消']
		}, function(){
		  	$.ajax({
		     	type:'DELETE',
		        url: IPAdress+'/admin/manager/deleteByIds/'+ids,
		        cache:false,
		        dataType:'text',
		        success:function(data){
		         	getData();
		         	layer.msg('删除成功', {icon: 1});
		        },
		        error:function(data){
		        	alert(data.status);
		        }
	     	});
		}, function(){

		});
    });

	//修改
	var changeId = -1;
	$('tbody').on('click','td .pink',function(){
		$("#update-admin").modal('show');
		 $("#updata_sel_productTag option").attr("selected", false);
		changeId=$(this).attr("change-Id");
		$.ajax({
			type:'GET',
			url:IPAdress+'/admin/manager/'+changeId,
			datype:'json',
			cache:'false',
			success:function(data){
				console.log(data);
				$.each(data.mRole,function(i,v){
					$('<option value="'+v.id+'" selected="selected">'+v.roleName+'</option>').appendTo('.sel_productTag');
				})
				loadData(data);
			},
			error:function(data){
			    alert(data.status);
			}
		});
	});
	$('#update').on('click',function(){
		var updateRole = $('#updata_sel_productTag').val();
		$('#updataRole').val(updateRole);
		$.ajax({
			type:'POST',
			url:IPAdress+'/admin/manager/update/'+changeId,
			data:$('#updateAdminForm').serialize(),
			dataType:'json',
			success:function(data){
				getData();
	         	$("#update-admin").modal('hide');
			},
			error:function(data){
			    alert(data.status);
			}
		})
	});

	//查询
	$('#search').on('click',function(){
		getData();
	});

	//返回
	$('#backdate').on('click',function(){
		$('#admin-name').val('');
		$('#create-time').val('');
		pageNum = 1;
		getData();
	});
})
