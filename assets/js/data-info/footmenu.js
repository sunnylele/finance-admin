var index;
var pageNum = 1;
var dataBox;
var relTime;
var menuCont;

if(sessionStorage.manager == undefined ){
	window.location.replace("./../../login.html");
}

//列表数据
function dataList(v){

	$(   '<tr>'
		+	'<td>'
		+		'<label>'
		+			'<input type="checkbox" class="ace" id="every" value="'+v.id+'">'
		+			'<span class="lbl"></span>'
		+		'</label>'
		+    '</td>'
		+	'<td>'+index+'</td>'
		+	'<td>'+v.name+'</td>'
		+	'<td>'+v.dict_id+'</td>'
		+	'<td class="cont" news-id="'+v.id+'">'
		+		'<div>'+v.content+'</div>'
		+	'</td>'
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
	var relTime = $('#rel-time').val();
	var menuCont = $('#menu-cont').val();
	var data={
		page:pageNum,
		createDate:relTime,
		content:menuCont
	}
	$.ajax({
		type:'GET',
		url:IPAdress+'/admin/footMenu/list',
		data: data,
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
		$("#addDate-foot").modal('show');
		$('.selectpicker').html('');
		$(".modal-body :input").not('input[type = "submit" ]').val('');
		$.ajax({
			type:'GET',
			url:IPAdress+'/admin/footMenu/findFootMenu',
			dataType:'json',
			success:function(data){
				//console.log(data);
				selectBox = data.data;
				$.each(selectBox,function(i,v){
					$('<option value="'+v.id+'">'+v.name+'</option>').appendTo('.selectpicker');
	            });
			},
			error:function(data){
			    alert(data.status);
			}
		});

		layui.use(['layedit','upload'], function(){
		  	var layedit = layui.layedit;
		  	layedit.build('demo');

		});

		$('#add-foot').on('click',function(){
			$.ajax({
				type:'POST',
				url:IPAdress+'/admin/footMenu/add',
				dataType:'json',
	        	data:$('#addFootForm').serialize(),
	        	cache: false,
				success:function(data){
					console.log(data)
					getData();
					$("#addDate-foot").modal('hide');
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
		        url:IPAdress+'/admin/footMenu/delete/'+id,
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

	//详情
    $('tbody').on('click','td.cont',function(){
    	$('#post-details').modal('show');
    	var newsId = $(this).attr("news-id");
    	$.ajax({
    		type:'GET',
			url:IPAdress+'/admin/footMenu/'+newsId,
			datype:'json',
			cache:'false',
			success:function(data){
				console.log(data);
				$('.foot-title').html(data.name);
				$('.createTime').html(toTime(data.createDate));
				$('.foot-list').html(data.content);
			},
			error:function(data){
			    alert(data.status);
			}
		});
    });

    $('#search').on('click',function(){
    	getData();
    })

    //返回
	$('#backdate').on('click',function(){
		$('#rel-time').val('');
		$('#menu-cont').val('');
		pageNum = 1;
		getData();
	})
});


