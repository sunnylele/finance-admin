var index;
var pageNum = 1;
var dataBox;
var nameDict;
var createTime;

if(sessionStorage.manager == undefined ){
	window.location.replace("./../../login.html");
}

//列表数据
function dataList(v){
	if(v.type == 1){
		v.type = '匿名吐槽';
	}else if(v.type == 2){
		v.type = '实名吐槽';
	}else if(v.type == 3){
		v.type = '新闻分类';
	}else if(v.type == 4){
		v.type = '兴趣标签'
	}else if(v.type == 5){
		v.type = '友情链接分类';
	}else if(v.type == 6){
		v.type = '理财收益说明';
	}else if(v.type == 7){
		v.type = '底部菜单';
	}else{
		v.type = v.type;
	}

	$(   '<tr>'
		+	'<td>'
		+		'<label>'
		+			'<input type="checkbox" class="ace" id="every" value="'+v.id+'">'
		+			'<span class="lbl"></span>'
		+		'</label>'
		+    '</td>'
		+	'<td>'+index+'</td>'
		+	'<td class="textLeft">'+v.name+'</td>'
		+	'<td>'+v.code+'</td>'
		+	'<td>'+v.parent_id+'</td>'
		+	'<td>'+v.type+'</td>'
		+	'<td>'+v.create_by+'</td>'
		+	'<td>'+toTime(v.create_date)+'</td>'
		+	'<td>'
		+		'<a class="red" href="#" del-Id="'+v.id+'">'
		+			'<i class="icon-trash bigger-130"></i>'
		+		'</a>'
		+	'</td>'
		+'</tr>').appendTo('tbody');
};

//渲染数据
function getData(){
	var nameDict = $('#name-dict').val();
	var createTime = $('#create-time').val();
	var data = {
		page: pageNum,
		name: nameDict,
		createDate: createTime
	}
	$.ajax({
		type:'GET',
		url:IPAdress+'/admin/dict/list',
		data:data,
		dataType:'json',
		cache:false,
		success:function(data){
			console.log(data);
			dataBox = data.data;
			$('tbody').html('');
			$('#pages-box').html('');
			if(dataBox.list == 0){
				$('<tr><td colspan="10">暂无匹配数据</td></tr>').appendTo('tbody');
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

	//添加
	$('.user-add').on('click',function(){
		$("#addDate-dict").modal('show');
		$(".modal-body :input").not('input[type = "button" ]').val('');
		str = sessionStorage.manager;
		obj = JSON.parse(str);
		var masterId = obj.id;
		$('#createUserName').val(masterId);

		$('.js-example-basic-single').select2({
	        width:'688px'
	    });

		$.ajax({
			type:'GET',
			url:IPAdress+'/admin/dict/findPdict',
			dataType:'json',
			success:function(data){
				console.log(data);
				selectBox = data.data;
				$.each(selectBox,function(i,v){
					$('<option value="'+v.id+'">'+v.name+'</option>').appendTo('#dicUp');
	            });
			},
			error:function(data){
			    alert(data.status);
			}
		});

		$('#add-dict').on('click',function(){
			$.ajax({
				type:'POST',
				url:IPAdress+'/admin/dict/add',
				dataType:'json',
				cache:false,
	        	data:$('#addDictForm').serialize(),
				success:function(data){
					getData();
					$("#addDate-dict").modal('hide');
				},
				error:function(data){
				    alert(data.status);
				}
			});
		})
	});

	//删除
	$('tbody').on('click','.red',function(event){
		var id=$(this).attr("del-Id");
  		layer.confirm('你确定要删除此信息吗？', {
		  	btn: ['确定','取消']
		}, function(){
		  	$.ajax({
		     	type:'DELETE',
		        url:IPAdress+'/admin/dict/delete/'+id,
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

	//查询
	$('#search').on('click',function(){
		getData();
	});
	//返回
	$('#backdate').on('click',function(){
		$('#name-dict').val('');
		$('#create-time').val('');
		pageNum = 1;
		getData();
	})
});


