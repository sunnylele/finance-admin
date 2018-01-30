var index;
var pageNum = 1;
var dataBox;
var nickName;
var createTime;
var trueName
var userType
var userAuthStatus
var authNum;
var dataId;
var auditId;
var authDataList;
var authStatus;


if(sessionStorage.manager == undefined ){
	window.location.replace("./../../login.html");
}

//列表数据
function dataList(v){
	//判断男女
	if(v.sex == 0){
		v.sex = '女';
	}else if(v.sex == 1){
		v.sex ='男';
	}else if(v.sex == 2){
		v.sex ='保密';
	}else if(v.sex == null){
		v.sex = '';
	};

	//判断用户类型
	if(v.type == 0){
		v.type = '../../assets/images/common.png';
	}else if(v.type == 1){
		v.type = '../../assets/images/real-name.png';
	}else if(v.type == 2){
		v.type = '../../assets/images/media.png';
	}else if(v.type == 3){
		v.type = '../../assets/images/expert.png';
	}else if(v.type == 4){
		v.type = '../../assets/images/origan.png';
	}else{
		v.type = '../../assets/images/common.png';
	};

	//判断是否上传头像
	if(v.photo == '' || v.photo == null){
		v.photo = 'http://wx.qlogo.cn/mmopen/57VrUC5owrBtZg7PUw1Ayx'
		         +'YhibIFbz4so2juicnxliclPk0rFzGyhIZUMLiaznAhO6UrUk6MIB4DQP6ibZHm7Ca2dz3u8BXc0TSxU/0';
	}else{
		v.photo = v.photo;
	};

	//推荐用户显示
	if(v.recommendType == 1){
		v.recommendType = '名人堂'
	}else if(v.recommendType == null){
		v.recommendType = '';
	}

	switch(v.aucount){
		case 1000:
			v.aucount = '未认证';
			break;
		case 10:
			v.aucount = '申请身份认证';
			break;
		case 20:
			v.aucount = '申请自媒体认证';
			break;
		case 30:
			v.aucount = '申请专家认证';
			break;
		case 40:
			v.aucount = '申请官方认证';
			break;
		case 11:
			v.aucount = '身份认证通过';
			break;
		case 12:
			v.aucount = '身份认证未通过';
			break;
		case 21:
			v.aucount = '自媒体认证通过';
			break;
		case 22:
			v.aucount = '自媒体认证未通过';
			break;
		case 31:
			v.aucount = '专家认证通过';
			break;
		case 32:
			v.aucount = '专家认证未通过';
			break;
		case 41:
			v.aucount = '官方认证通过';
			break;
		case 42:
			v.aucount = '官方认证未通过';
			break;
	}

	if(v.createDate != null){
		v.createDate = toTime(v.createDate);
	}else{
		v.createDate = ''
	}

	$(   '<tr>'
		+	'<td>'
		+		'<label>'
		+			'<input type="checkbox" class="ace" id="every" value="'+v.id+'">'
		+			'<span class="lbl"></span>'
		+		'</label>'
		+    '</td>'
		+	'<td>'+index+'</td>'
		+	'<td>'
		+		'<img class="headImg" src="'+v.photo+'" alt="" width="30" height="30" style="border-radius:50%;" />'
		+		'<b class="zoomImg"><img src="'+v.photo+'"/></b>'
		+	'</td>'
		+	'<td class="userNameColor">'+v.nickName+'</td>'
		+	'<td>'+v.trueName+'</td>'
		+	'<td class="sex">'+v.sex+'</td>'
		+	'<td>'+v.mobile+'</td>'
		+	'<td>'+v.recommendType+'</td>'
		+	'<td class="type">'
		+ 		'<img src="'+v.type+'" alt="" width="15">'
		+  '</td>'
		+	'<td>'+v.createDate+'</td>'
		+	'<td>'
		+		'<button type="button" class="btn btn-info btn-xs dataMessage" audit="'+v.id+'" authAll="'+v.aucount+'" id="examine_'+v.id+'">'+v.aucount+'</button>'
		+	'</td>'
		+	'<td>'
		+		'<a class="pink" href="#" change-Id="'+v.id+'">'
		+			'<i class="icon-pencil"></i>'
		+		'</a>'
		+		'<a class="red" href="#" data-Id="'+v.id+'">'
		+			'<i class="icon-trash bigger-130"></i>'
		+		'</a>'
		+	'</td>'
		+'</tr>').appendTo('tbody');
};

//渲染数据
function getData(){
	var trueName = $('#userTrueName').val();
	var nickName = $('#nick').val();
	var createTime = $('#create-time').val();
	var userType = $('#userType').val();
	var userAuthStatus = $('#userAuthStatus').val();
	data = {
		page: pageNum,
		trueName: trueName,
		nickName: nickName,
		createDate: createTime,
		type: userType,
		aucount: userAuthStatus
	};
	$.ajax({
		type:'GET',
		url:IPAdress+'/admin/user/list',
		data: data,
		dataType:'json',
		cache:false,
		success:function(data){
			console.log(data)
			dataBox = data.data;
			$('tbody').html('');
			$('#pages-box').html('');
			if(dataBox.list == 0){
				$('<tr><td colspan="12">暂无匹配数据</td></tr>').appendTo('tbody');
				return;
			}else{
				index=(dataBox.pageNum-1)*20;
				$.each(dataBox.list,function(i,v){
					index++;
					dataList(v);
				});
				rendPage(dataBox);
			}
		},
		error:function(data){
		    alert(data.status);
		}
	});
};

//身份认证
function authIDNumber(){
	$.ajax({
		type:'GET',
		url:IPAdress+'/admin/user/findUserAuthInfo/'+auditId,
		datype:'json',
		cache:'false',
		success:function(data){
			$('#audit-IDNumber').modal('show');
			$('.IDNumber-dataPhoto').html('');
			authDataList = data.data.authentications;
			$.each(authDataList,function(i,v){
				var pic = v.pic;
				var pics = new Array();
				if(pic != null && pic.indexOf(',') != -1) {
					pics = pic.split(",");
					for(var i=0;i<pics.length;i++){
						$('<li><img src=" '+pics[i]+' " alt="" width="100" height="100" /></li>').appendTo('.IDNumber-dataPhoto');
					}
				}else{
					$('.IDNumber-dataPhoto').hide();
					$('.IDNumberImgShow').show();
				};
				if(v.type == 1){
					$('.IDNumber-name').html(v.trueName);
					$('.IDNumber-card').html(v.idNumber);
					$('.IDNumber-company').html(v.company);
					$('.IDNumber-short').html(v.companyShort)
					$('.IDNumber-position').html(v.position);
					$('.IDNumber-field').html(v.realm);
					$('.IDNumber-intro').html(v.intro);
					dataId = v.id;
				};
			});
		},
		error:function(data){
		    alert(data.status);
		}
	});
}


//官方认证
function authOfficial(){
	$.ajax({
		type:'GET',
		url:IPAdress+'/admin/user/findUserAuthInfo/'+auditId,
		datype:'json',
		cache:'false',
		success:function(data){
			$('#audit-official').modal('show');
			$('.official-dataPhoto').html('');
			authDataList = data.data.authentications;
			$.each(authDataList,function(i,v){
				if(v.type == 4){
					var pic = v.pic;
					var pics = new Array();
					if(pic != null && pic.indexOf(',') != -1) {
						pics = pic.split(",");
						for(var i=0;i<pics.length;i++){
							$('<li><img src=" '+pics[i]+' " alt="" width="100" height="100" /></li>').appendTo('.official-dataPhoto');
						}
					};
					$('.official-companyName').html(v.company);
					$('.official-short').html(v.companyShort);
					$('.official-intro').html(v.intro);
					$('.official-card').html(v.idNumber);
					dataId = v.id;
				};
			});
		},
		error:function(data){
		    alert(data.status);
		}
	});
};

//自媒体认证
function authWemedia(){
	$.ajax({
		type:'GET',
		url:IPAdress+'/admin/user/findUserAuthInfo/'+auditId,
		datype:'json',
		cache:'false',
		success:function(data){
			$('#audit-wemedia').modal('show');
			authDataList = data.data.authentications;
			console.log(authDataList);
			$.each(authDataList,function(i,v){
				if(v.type == 2){
					$('.wemedia-name').html(v.trueName);
					$('.wemedia-card').html(v.idNumber);
					$('.wemedia-field').html(v.realm);
					$('.wemwdiaDataintro').html(v.intro);
					dataId = v.id;
				}
			});
		},
		error:function(data){
		    alert(data.status);
		}
	});
};

//专家认证
function authExpert(){
	$.ajax({
		type:'GET',
		url:IPAdress+'/admin/user/findUserAuthInfo/'+auditId,
		datype:'json',
		cache:'false',
		success:function(data){
			$('#audit-expert').modal('show');
			$('.expert-dataPhoto').html('');
			authDataList = data.data.authentications;
			$.each(authDataList,function(i,v){
				if(v.type == 3){
					var pic = v.pic;
					var pics = new Array();
					if(pic != null && pic.indexOf(',') != -1) {
						pics = pic.split(",");
						for(var i=0;i<pics.length;i++){
							$('<li><img src=" '+pics[i]+' " alt="" width="100" height="100" /></li>').appendTo('.expert-dataPhoto');
						}
					}else{
						$('.expert-dataPhoto').hide();
						$('.expertImgShow').show();
					};
					$('.expert-name').html(v.trueName);
					$('.expert-field').html(v.realm);
					$('.expert-intro').html(v.intro);
					dataId = v.id;
				}
			});
		},
		error:function(data){
		    alert(data.status);
		}
	});
}

//会员信息渲染
$(function(){

	str = sessionStorage.manager;
    obj = JSON.parse(str);
    var master = obj.userName;
    //console.log(master)

    $('#master').html(master);

	getData();

	//下一页
	$('#pages-box').on('click','li.next',function(){
		if(nextPage==0){
			pageNum=totalPages;
			return;
		}else{
			pageNum = nextPage;
		}
		getData();
	})
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



	//添加用户信息
	$('.user-add').on('click',function(){
		$("#addDate-user").modal('show');
		$(".modal-body :input").not('input[type = "submit" ]').val('');
		$('#add-user').on('click',function(){
			$('#addUserForm').validate({
				submitHandler : function (form) {
					$.ajax({
						type:'POST',
						url:IPAdress+'/admin/user/addUser',
						dataType:'json',
			        	data:$('#addUserForm').serialize(),
						success:function(data){
							getData();
			         		$("#addDate-user").modal('hide');
						},
						error:function(data){
						    alert(data.status);
						}
					});
				},
				rules : {
					trueName : {
						required : true,
					},
					nickName : {
						required : true,
					},
					mobile : {
						required : true,
					}
				},
				messages : {
					trueName : {
						required : '请输入您的姓名！',
					},
					nickName : {
						required : '请输入您的昵称！',
					},
					mobile : {
						required : '请输入您的手机号码！',
					}
				}
			});
		})
	});

	//批量删除
     $(".del-info").click(function() {
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
		        url:IPAdress+'/admin/user/deleteByIds/'+ids,
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

	//单个删除
	$('tbody').on('click','.red',function(event){
		var id=$(this).attr("data-Id");
  		layer.confirm('你确定要删除此信息吗？', {
		  	btn: ['确定','取消']
		}, function(){
		  	$.ajax({
		     	type:'DELETE',
		        url:IPAdress+'/admin/user/delete/'+id,
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
		$("#update-user").modal('show');
		changeId = $(this).attr("change-Id");
		$.ajax({
			type:'GET',
			url:IPAdress+'/admin/user/'+changeId,
			datype:'json',
			cache:'false',
			success:function(data){
				//console.log(data);
				loadData(data);
				if(data.sex == 0){
					$('#user-sex').val('女');
				}else if(data.sex == 1){
					$('#user-sex').val('男');
				}else if(data.sex == 2){
					$('#user-sex').val('保密');
				}else{
					$('#user-sex').val(data.sex);
				};
				if(data.birthday != null){
					data.birthday = toTime(v.createDate);
				}else{
					data.birthday = ''
				}
				$('#user-birth').val(data.birthday);
			},
			error:function(data){
			    alert(data.status);
			}
		});
	});
	$('#update').on('click',function(){
		$.ajax({
			type:'POST',
			url:IPAdress+'/admin/user/update/'+changeId,
			data:$('#updateUserForm').serialize(),
			dataType:'json',
			success:function(data){
				getData();
	         	$("#update-user").modal('hide');
			},
			error:function(data){
			    alert(data.status);
			}
		});
	});

	//查询
	$('#search').on('click',function(){
		getData();
	});
	//返回
	$('#backdate').on('click',function(){
		$('#nick').val('');
		$('#create-time').val('');
		$('#userTrueName').val('')
		$('#userType').val('');
		$('#userAuthStatus').val('')
		pageNum = 1;
		getData();
	});

	//审核
	$('tbody').on('click','td button',function(){

		auditId = $(this).attr("audit");
		authNum = $(this).attr("authAll");

		if(authNum == '申请身份认证'){
			authIDNumber();
		}else if(authNum == '申请自媒体认证'){
			authWemedia();
		}else if(authNum == '申请专家认证'){
			authExpert();
		}else if(authNum == '申请官方认证'){
			authOfficial();
		}else if(authNum == '未认证'){
			layer.msg('该用户未上传认证资料');
		}else{
			$.ajax({
				type:'GET',
				url:IPAdress+'/admin/user/findUserAuthInfo/'+auditId,
				datype:'json',
				cache:'false',
				success:function(data){
					$('#audit-details').modal('show');//模态框
					$('#dowebok').viewer();
					//显示图片
					$('.IDNumber-dataPhoto').html('');
					$('.expert-dataPhoto').html('');
					$('.official-dataPhoto').html('');
					//审核数据
					$('.listcont1 p span').html('');
					$('.listcont2 p span').html('');
					$('.listcont3 p span').html('');
					$('.listcont4 p span').html('');
					//审核状态
					$('.auth-success').hide();
					$('.auth-fail').hide();
					$('.tu').hide();
					//审核的详细数据
					authDataList = data.data.authentications;
					console.log(authDataList)
					$.each(authDataList,function(i,v){
						switch(v.type){
							case 1: //身份认证
								var pic = v.pic;
								var pics = new Array();
								if(pic != null && pic.indexOf(',') != -1) {
									pics = pic.split(",");
									for(var i=0;i<pics.length;i++){
										$('<li><img src=" '+pics[i]+' " alt="" width="100" height="100" /></li>').appendTo('.IDNumber-dataPhoto');
									}
								}else{
									$('.IDNumber-dataPhoto').hide();
									$('.IDNumberImgShow').show();
								};
								$('.IDNumber-name').html(v.trueName);
								$('.IDNumber-card').html(v.idNumber);
								$('.IDNumber-company').html(v.company);
								$('.IDNumber-short').html(v.companyShort)
								$('.IDNumber-position').html(v.position);
								$('.IDNumber-field').html(v.realm);
								$('.IDNumber-intro').html(v.intro);
								dataId = v.id;
								if(v.status == 1){
									$('.listcont1 .auth-success').show();
									$('.listcont1 .auth-fail').hide();
								}else if(v.status == 2){
									$('.listcont1 .auth-fail').show();
									$('.listcont1 .auth-success').hide();
								}
								break;
							case 2: //自媒体认证
								$('.wemedia-name').html(v.trueName);
								$('.wemedia-card').html(v.idNumber);
								$('.wemedia-field').html(v.realm);
								$('.wemwdiaDataintro').html(v.intro);
								dataId = v.id;
								if(v.status == 1){
									$('.listcont2 .auth-success').show();
									$('.listcont2 .auth-fail').hide();
								}else if(v.status == 2){
									$('.listcont2 .auth-fail').show();
									$('.listcont2 .auth-success').hide();
								}
								break;
							case 3: //专家认证
								var pic = v.pic;
								var pics = new Array();
								if(pic != null && pic.indexOf(',') != -1) {
									pics = pic.split(",");
									for(var i=0;i<pics.length;i++){
										$('<li><img src=" '+pics[i]+' " alt="" width="100"  height="100" /></li>').appendTo('.expert-dataPhoto');
									}
								}else{
									$('.expert-dataPhoto').hide();
									$('.expertImgShow').show();
								};
								$('.expert-name').html(v.trueName);
								$('.expert-field').html(v.realm);
								$('.expert-intro').html(v.intro);
								dataId = v.id;
								if(v.status == 1){
									$('.listcont3 .auth-success').show();
									$('.listcont3 .auth-fail').hide();
								}else if(v.status == 2){
									$('.listcont3 .auth-fail').show();
									$('.listcont3 .auth-success').hide();
								}
								break;
							case 4: //官方认证
								var pic = v.pic;
								var pics = new Array();
								if(pic != null && pic.indexOf(',') != -1) {
									pics = pic.split(",");
									for(var i=0;i<pics.length;i++){
										$('<li><img src=" '+pics[i]+' " alt="" width="100" height="100" /></li>').appendTo('.official-dataPhoto');
									}
								}else{
									$('.official-dataPhoto').hide();
									$('.officialImgShow').show();
								};
								$('.official-companyName').html(v.company);
								$('.official-short').html(v.companyShort);
								$('.official-intro').html(v.intro);
								$('.official-card').html(v.idNumber);
								dataId = v.id;
								if(v.status == 1){
									$('.listcont4 .auth-success').show();
									$('.listcont4 .auth-fail').hide();
								}else if(v.status == 2){
									$('.listcont4 .auth-fail').show();
									$('.listcont4 .auth-success').hide();
								}
								break;

						}
					});
				},
				error:function(data){
				    alert(data.status);
				}
			});
		};

		//审核通过
		$('.audit-success').on('click',function(){
			$(".audit-success").attr("disabled",true);
			$(".audit-success").css('background','#ccc');
			$.ajax({
				type:'POST',
				url:IPAdress+'/admin/user/authPass/'+dataId,
				datype:'json',
				cache:'false',
				success:function(data){
					console.log(data);
					if(data.data == 1){
						layer.msg('用户审核成功', {icon: 6});
						$('#audit-IDNumber').modal('hide');
						$('#audit-wemedia').modal('hide');
						$('#audit-expert').modal('hide');
						$('#audit-official').modal('hide');
						getData();
					}else{
						layer.msg('用户审核失败');
						$('#audit-IDNumber').modal('hide');
						$('#audit-wemedia').modal('hide');
						$('#audit-expert').modal('hide');
						$('#audit-official').modal('hide');
						getData();
					}
				},
				error:function(data){
				    alert(data.status);
				}
			});
		});

		//审核不通过
		$('.audit-fail').on('click',function(){
			$(".audit-fail").attr("disabled",true);
			$(".audit-fail").css('background','#ccc');
			$.ajax({
				type:'POST',
				url:IPAdress+'/admin/user/authNoPass/'+dataId,
				datype:'json',
				cache:'false',
				success:function(data){
					console.log(data);
					if(data.data == 1){
						layer.msg('用户审核成功', {icon: 5});
						$('#audit-IDNumber').modal('hide');
						$('#audit-wemedia').modal('hide');
						$('#audit-expert').modal('hide');
						$('#audit-official').modal('hide');
						getData();
					}else{
						layer.msg('用户审核失败');
						$('#audit-IDNumber').modal('hide');
						$('#audit-wemedia').modal('hide');
						$('#audit-expert').modal('hide');
						$('#audit-official').modal('hide');
						getData();
					}
				},
				error:function(data){
				    alert(data.status);
				}
			});
		});
	})
});


