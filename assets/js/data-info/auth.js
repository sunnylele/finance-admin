var pageNum = 1;
var index;
var dataBox;

if(sessionStorage.manager == undefined ){
	window.location.replace("./../../login.html");
}

//数据列表
function dataList(v){

	if(v.code == '' || v.code == null){
		v.code = '';
	};
	if(v.url == '' || v.url == null){
		v.url = '';
	};

	$(  '<tr>'
		+	'<td>'
		+		'<label>'
		+			'<input type="checkbox" class="ace" id="every" value="'+v.id+'"/>'
		+			'<span class="lbl"></span>'
		+		'</label>'
		+    '</td>'
		+	'<td>'+v.id+'</td>'
		+	'<td class="userNameColor">'+v.name+'</td>'
		+	'<td>'+v.code+'</td>'
		+	'<td>'+v.pId+'</td>'
		+	'<td>'+v.url+'</td>'
		+	'<td>'
		+		'<a class="pink" href="#" change-Id="'+v.id+'">'
		+			'<i class="icon-pencil"></i>'
		+		'</a>'
		+		'<a class="red" href="#" del-Id="'+v.id+'">'
		+			'<i class="icon-trash bigger-130"></i>'
		+		'</a>'
		+	'</td>'
		+'</tr>').appendTo('tbody');
};

//数据渲染
function getData(){
	$.ajax({
		type:'GET',
		url:IPAdress+'/admin/manager/listAuth',
		dataType:'json',
		cache:false,
		success:function(data){
			//console.log(data)
			dataBox = data.data
			$('tbody').html('');
			$('#pages-box').html('');
			$.each(dataBox,function(i,v){
				dataList(v);
            });
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

	//创建树
	function createTree(){
		$.ajax({
			type:'GET',
			url:IPAdress+'/admin/manager/listAuth',
			dataType:'json',
			success:function(data){
				zNodes = data.data;
				var treeObj = $.fn.zTree.init($("#treeDemo"), setting, zNodes);
				var nodes = treeObj.getNodes();
				if(nodes.length > 0){
					for(var i=0; i<nodes.length; i++){
						treeObj.expandNode(nodes[i],true,false,false);
					}
				}
			}
		})
	};
	var setting = {
		view: {
			selectedMulti: true,
			showLine:true,
			showIcon: true
		},
		edit: {
			enable: true,
			showRemoveBtn: false,
			showRenameBtn: false
		},
		data: {
			keep: {
				parent:true,
				leaf:true
			},
			simpleData: {
				enable: true
			}
		}
	};
	$(document).ready(function(){
		createTree();
	});

	//添加
	$('.user-add').on('click',function(){
		$("#addDate-auth").modal('show');
		$(".modal-body :input").not('input[type = "submit" ]').val('');

		$('.js-example-basic-single').select2({
	        width:'488px'
	    });

		$.ajax({
			type:'GET',
			url:IPAdress+'/admin/manager/listAuth',
			dataType:'json',
			success:function(data){
				//console.log(data);
				selectBox = data.data;
				$.each(selectBox,function(i,v){
					$('<option value="'+v.id+'">'+v.name+'</option>').appendTo('#dicUp');
	            });
			},
			error:function(data){
			    alert(data.status);
			}
		});
		$('#add-auth').on('click',function(){
			$('#addAuthForm').validate({
				submitHandler : function (form) {
					$.ajax({
						type:'POST',
						url:IPAdress+'/admin/manager/addAuth',
						data:$('#addAuthForm').serialize(),
						success:function(data){
							getData();
							$("#addDate-auth").modal('hide');
						},
						error:function(data){
						    alert(data.status);
						}
					});
				},
				rules : {
					name : {
						required : true,
					},
					pId : {
						required : true,
					}
				},
				messages : {
					name : {
						required : '请输入权限名！',
					},
					pId : {
						required : '请输入您要添加的权限所对应父节点！',
					}
				}
			});
		})
	});

	//单个删除
	$('tbody').on('click','.red',function(event){
		var id=$(this).attr("del-Id");
  		layer.confirm('你确定要删除此信息吗？', {
		  	btn: ['确定','取消']
		}, function(){
		  	$.ajax({
		     	type:'DELETE',
		        url:IPAdress+'/admin/manager/delAuth/'+id,
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
		$("#update-auth").modal('show');
		changeId = $(this).attr("change-Id");
		$.ajax({
			type:'GET',
			url:IPAdress+'/admin/manager/findAuthById/'+changeId,
			datype:'json',
			cache:'false',
			success:function(data){
				loadData(data.data);
			},
			error:function(data){
			    alert(data.status);
			}
		});
	});
	$('#update').on('click',function(){
		$.ajax({
			type:'POST',
			url:IPAdress+'/admin/manager/updateAuth/'+changeId,
			data:$('#updateAuthForm').serialize(),
			dataType:'json',
			success:function(data){
				getData();
	         	$("#update-auth").modal('hide');
			},
			error:function(data){
			    alert(data.status);
			}
		})
	});
})
