var pageNum = 1;
var index;
var dataRoleName;
var dataBox;
var authBox;
var authList;

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
		+	'<td class="userNameColor">'+v.roleName+'</td>'
		+	'<td>'+v.roleDesc+'</td>'
		+	'<td>'
		+		'<a class="red" href="#" del-Id="'+v.id+'">'
		+			'<i class="icon-trash bigger-130"></i>'
		+		'</a>'
		+	'</td>'
		+'</tr>').appendTo('#roledata tbody');
};

//数据渲染
function getData(){
	$.ajax({
		type:'GET',
		url:IPAdress+'/admin/manager/listRole?page='+pageNum,
		dataType:'json',
		cache:false,
		success:function(data){
			dataBox = data.data;
			$('tbody').html('');
			$('#pages-box').html('');
			index=(dataBox.pageNum-1)*20;
			$.each(dataBox.list,function(i,v){
				index++;
				dataList(v);
            });
            dataRoleName = dataBox.list;
            rendPage(dataBox);
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

	//添加
	$('.user-add').on('click',function(){
		$("#role-admin").modal('show');
		$(".modal-body :input").not('input[type = "submit" ]').val('');
		$('#add-rolename').on('click',function(){
			var str="";
			var ids;
			$('.check-list input[name="item"]:checkbox').each(function(){
				if($(this).is(":checked")){
					str += $(this).attr("value")+",";
					}
			});
			str = str.substring(0,str.length-1);
			ids = str;
			$('#selectauth').val(ids);
			$('#roleAdminForm').validate({
				submitHandler : function (form) {
					$.ajax({
						type:'POST',
						url:IPAdress+'/admin/manager/addRole',
						dataType:'json',
			        	data:$('#roleAdminForm').serialize(),
						success:function(data){
							getData();
							$("#role-admin").modal('hide');
						},
						error:function(data){
						    alert(data.status);
						}
					});
				},
				rules : {
					roleName : {
						required : true,
					},
				},
				messages : {
					roleName : {
						required : '请输入您的角色名！',
					}
				}
			});
		})
	});

	//单个删除
	$('tbody').on('click','.red',function(){
		var delId=$(this).attr("del-Id");
        layer.confirm('你确定要删除此信息吗？', {
		  	btn: ['确定','取消']
		}, function(){
		  	$.ajax({
		     	type:'DELETE',
		        url:IPAdress+'/admin/manager/deleteRoleById/'+delId,
		        cache:false,
		        dataType:'json',
		        success:function(data){
		        	//console.log(data);
		        	if(data.data == 1){
		        		getData();
			         	layer.msg('删除成功', {icon: 1});
		        	}else{
		        		layer.msg("网络异常，请稍后重试！");
		        	}
		        },
		        error:function(data){
		        	alert(data.status);
		        }
	     	});
		}, function(){

		});
	});
	//通过角色查询角色对应的权限
	$('#search').on('click',function(){
		var Id = 0;
    	var roleName = $('#role-name').val();
    	$.each(dataRoleName,function(i,v){
    		if(roleName==v.roleName){
    			Id=v.id;
    		}
    	});
		var URL = null;
			URL = IPAdress+`/admin/manager/findManagerAuthByRoleId/`+Id;
		$.ajax({
			type:'GET',
			url:URL,
			dataType:'json',
			cache:false,
			success:function(data){
				console.log(data);
				$('#role-title').html(`${roleName}相对应的权限`);
				$('#roledata').hide();
				$('#pages-box').html('');
				$('#authdata').show();
				if(data.data == 0){
					$('<tr><td colspan="4">暂无权限</td></tr>').appendTo('#authdata tbody');
				}else{
					$.each(data.data,function(i,v){
						$(  '<tr>'
							+	'<td>'+v.id+'</td>'
							+	'<td>'+v.name+'</td>'
							+	'<td>'+v.code+'</td>'
							+	'<td>'+v.pId+'</td>'
							+'</tr>').appendTo('#authdata tbody');
					})
				}
			},
			error:function(data){
				alert(data.status);
			}
		})
    });


    //返回
	$('#backdate').on('click',function(){
		$('#authdata').hide();
		$('#roledata').show();
		$('#role-name').val('');
		getData();
	});
})