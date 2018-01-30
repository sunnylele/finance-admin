var index;
var pageNum = 1;
var dataBox;
var helpProblem;

if(sessionStorage.manager == undefined ){
	window.location.replace("./../../login.html");
}

//列表数据
function dataList(v){

	if(v.type == 1){
		v.type = '热点问题';
	}else if(v.type == 2){
		v.type = '积分问题';
	}else if(v.type == 3){
		v.type = '匿名吐槽';
	}else if(v.type == 4){
		v.type = '扎堆儿';
	}

	$(   '<tr>'
		+	'<td>'
		+		'<label>'
		+			'<input type="checkbox" class="ace" id="every" value="'+v.id+'">'
		+			'<span class="lbl"></span>'
		+		'</label>'
		+    '</td>'
		+	'<td>'+index+'</td>'
		+	'<td class="textLeft">'+v.question+'</td>'
		+	'<td class="cont" news-id="'+v.id+'">'
		+		'<div>'+v.answer+'</div>'
		+	'</td>'
		+	'<td>'+v.type+'</td>'
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

//渲染数据
function getData(){
	helpProblem = $('#help-problem').val();
	var data={
		page:pageNum,
		question:helpProblem
	}
	$.ajax({
		type:'GET',
		url:IPAdress+'/admin/help/list',
		data: data,
		dataType:'json',
		cache:false,
		success:function(data){
			//console.log(data);
			dataBox = data.data;
			$('tbody').html('');
			$('#pages-box').html('');
			if(dataBox.list == 0){
				$('<tr><td colspan="6">暂无匹配数据</td></tr>').appendTo('tbody');
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
		if(nextPage == 0){
			pageNum = totalPages;
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

	//添加
	$('.user-add').on('click',function(){
		$("#addDate-help").modal('show');
		$('textarea').val('');
		$('.selectpicker').val('');
	});
	$('#add-foot').on('click',function(){
		$.ajax({
			type:'POST',
			url:IPAdress+'/admin/help/addHelp',
			dataType:'json',
        	data:$('#addHelpForm').serialize(),
        	cache: false,
			success:function(data){
				//console.log(data)
				getData();
				$("#addDate-help").modal('hide');
			},
			error:function(data){
			    alert(data.status);
			}
		});
	});

	//删除
	$('tbody').on('click','.red',function(event){
		var delId = $(this).attr("del-Id");
  		layer.confirm('你确定要删除此信息吗？', {
		  	btn: ['确定','取消']
		}, function(){
		  	$.ajax({
		     	type:'DELETE',
		        url:IPAdress+'/admin/help/delete/'+delId,
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
		$("#update-help").modal('show');
		changeId = $(this).attr("change-Id");
		$.ajax({
			type:'GET',
			url:IPAdress+'/admin/help/'+changeId,
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
			url:IPAdress+'/admin/help/update/'+changeId,
			data:$('#updateHelpForm').serialize(),
			dataType:'json',
			success:function(data){
				getData();
				$("#update-help").modal('hide');
			},
			error:function(data){
			    alert(data.status);
			}
		})
	});

	//发布详情
	var detailBox;
    $('tbody').on('click','td.cont',function(){
    	$('#post-details').modal('show');
    	var newsId = $(this).attr("news-id");
    	$.ajax({
    		type:'GET',
			url:IPAdress+'/admin/help/'+newsId,
			datype:'json',
			cache:'false',
			success:function(data){
				//console.log(data);
				detailBox = data.data
				$('.help-qustion').html(detailBox.question);
				$('.help-answer').html(detailBox.answer);
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

	 $('#backdate').on('click',function(){
	 	$('#help-problem').val('');
	 	pageNum = 1;
		getData();
	})
});


