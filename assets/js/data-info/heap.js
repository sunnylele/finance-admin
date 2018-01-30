var pageNum = 1;
var index = 0;
var dataBox;
var creatTime;
var heapUser;

if(sessionStorage.manager == undefined ){
	window.location.replace("./../../login.html");
}

function dataList(v){
	//判断是否上传头像
	if(v.photo == '' || v.photo == null){
		v.photo = 'http://wx.qlogo.cn/mmopen/57VrUC5owrBtZg7PUw1Ayx'
		         +'YhibIFbz4so2juicnxliclPk0rFzGyhIZUMLiaznAhO6UrUk6MIB4DQP6ibZHm7Ca2dz3u8BXc0TSxU/0';
	}else{
		v.photo = v.photo;
	};

	$(  '<tr>'
		+	'<td>'
		+		'<label>'
		+			'<input type="checkbox" class="ace" id="every" value="'+v.id+'">'
		+			'<span class="lbl"></span>'
		+		'</label>'
		+    '</td>'
		+	'<td>'+index+'</td>'
		+	'<td class="userNameColor">'+v.name+'</td>'
		+	'<td>'
		+		'<img class="headImg" src="'+v.photo+'" alt="" width="50" />'
		+		'<b class="zoomImg"><img src="'+v.photo+'"/></b>'
		+	'</td>'
		+	'<td>'+v.member+'</td>'
		+	'<td class="cont" new-id="'+v.id+'">'
		+		'<div>'+v.intro+'</div>'
		+	'</td>'
		+	'<td class="cont" new-id="'+v.id+'">'
		+		'<div>'+v.notice+'</div>'
		+	'</td>'
		+	'<td>'+v.praise_num+'</td>'
		+	'<td>'+v.integral+'</td>'
		+	'<td>'+toTime(v.create_date)+'</td>'
		+	'<td>'
		+		'<a class="pink" href="#" change-Id="'+v.id+'">'
		+			'<i class="icon-pencil"></i>'
		+		'</a>'
		+		'<a class="red" href="#" del-Id="'+v.id+'">'
		+			'<i class="icon-trash bigger-130"></i>'
		+		'</a>'
		+	'</td>'
		+'</tr>').appendTo('tbody');

	//判断状态是否正常
	if(v.status == 0){
		$('#check_'+index).attr('checked',false);
	}else if(v.status == 1){
		$('#check_'+index).attr('checked',true);
	}
};

function getData(){
	var creatTime = $('#creat-time').val();
	var heapUser = $('#heap-user').val();
	data = {
		page: pageNum,
		createDate:creatTime,
		name:heapUser
	}
	$.ajax({
		type:'get',
		url:IPAdress+'/admin/heap/list',
		data:data,
		dataType:'json',
		cache:false,
		success:function(data){
			console.log(data);
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

$(function(){

	str = sessionStorage.manager;
    obj = JSON.parse(str);
    var master = obj.userName;
    //console.log(master)

    $('#master').html(master);

	getData();

	//点击页码
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

	//单个删除
	$('tbody').on('click','.red',function(){
		var delId=$(this).attr('del-Id');
        layer.confirm('你确定要删除此信息吗？', {
		  	btn: ['确定','取消']
		}, function(){
		  	$.ajax({
		     	type:'DELETE',
		        url:IPAdress+'/admin/heap/delete/'+delId,
		        cache:false,
		        dataType:'json',
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
        var ids = getIds();
        alert(ids)
        if(null == ids || "" == ids || "undefined" == typeof ids) {
           	layer.msg("请选择至少一项！",{
            	time: 2000
            });
            return;
        };
        layer.confirm('你确定要删除所选择的信息吗？', {
		  	btn: ['确定','取消']
		}, function(){
		  	$.ajax({
		     	type:'DELETE',
		        url:IPAdress+'/admin/heap/deleteByIds/'+ids,
		        cache:false,
		        dataType:'json',
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
		$("#update-heap").modal('show');
		changeId = $(this).attr("change-Id");
		$.ajax({
			type:'GET',
			url:IPAdress+'/admin/heap/'+changeId,
			datype:'json',
			cache:'false',
			success:function(data){
				loadData(data);
			},
			error:function(data){
			    alert(data.status);
			}
		});
	});
	$('#update').on('click',function(){
		$.ajax({
			type:'POST',
			url:IPAdress+'/admin/heap/update/'+changeId,
			data:$('#updateHeapForm').serialize(),
			dataType:'json',
			success:function(data){
				getData();
	         	$("#update-heap").modal('hide');
			},
			error:function(data){
			    alert(data.status);
			}
		});
	});

	//详情
    $('tbody').on('click','td.cont',function(){
    	$('#post-details').modal('show');
    	var newId = $(this).attr("new-id");
    	$.ajax({
    		type:'GET',
			url:IPAdress+'/admin/heap/'+newId,
			datype:'json',
			cache:'false',
			success:function(data){
				console.log(data);
				$(".heapPhoto").attr('src',data.photo);
				$('.heapName').html(data.name);
				$('.createTime').html(toTime(data.create_date));
				$('.host').html(data.masterName);
				$('.mem').html(data.memberNum);
				$('.ming').html(data.monthRank);
				$('.dianzan').html(data.praiseNum);
				$('.jifen').html(data.integral);
				$('.int').html(data.intro);
				$('.gonggao').html(data.notice);
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
		$('#creat-time').val('');
		$('#heap-user').val('');
		pageNum = 1;
		getData();
	})
})