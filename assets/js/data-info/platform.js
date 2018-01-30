var index;
var pageNum = 1;
var dataBox;
var createTime;
var platTitle;

if(sessionStorage.manager == undefined ){
	window.location.replace("./../../login.html");
}

//列表数据
function dataList(v){
	if(v.hot == 0){
		v.hot = '正常帖';
	}else if(v.hot == 1){
		v.hot = '热帖';
	}

	$(   '<tr>'
		+	'<td>'
		+		'<label>'
		+			'<input type="checkbox" class="ace" id="every" value="'+v.id+'">'
		+			'<span class="lbl"></span>'
		+		'</label>'
		+    '</td>'
		+	'<td>'+index+'</td>'
		+	'<td class="textLeft">'+v.title+'</td>'
		+	'<td>'+v.read_num+'</td>'
		+	'<td>'+v.discuss_num+'</td>'
		+	'<td>'+v.join_num+'</td>'
		+	'<td>'+v.praise_num+'</td>'
		+	'<td>'+v.hot+'</td>'
		+	'<td>'+v.create_by+'</td>'
		+	'<td>'+toTime(v.create_date)+'</td>'
		+	'<td>'
		+		'<a class="pink" href="#">'
		+			'<i class="icon-pencil"></i>'
		+		'</a>'
		+		'<a class="red" href="#">'
		+			'<i class="icon-trash bigger-130"></i>'
		+		'</a>'
		+	'</td>'
		+'</tr>').appendTo('tbody');

	//判断状态是否正常
	if(v.status  == 0){
		$('#check_'+index).attr('checked',false);
	}else if(v.status == 1){
		$('#check_'+index).attr('checked',true);
	}
};

//渲染数据
function getData(){
	var createTime = $('#create-time').val();
	var platTitle = $('#plat-title').val();
	data = {
		page: pageNum,
		createDate: createTime,
		title: platTitle
	}
	$.ajax({
		type:'GET',
		url:IPAdress+'/admin/discovery/need/list',
		data:data,
		dataType:'json',
		cache:false,
		success:function(data){
			//console.log(data);
			dataBox = data.data;
			$('tbody').html('');
			$('#pages-box').html('');
			if(dataBox.list == 0){
				$('<tr><td colspan="14">暂无匹配数据</td></tr>').appendTo('tbody');
				return;
			}else{
				index=(dataBox.pageNum-1)*20;
				$.each(dataBox.list,function(i,v){
					index++;
					dataList(v);
				});
				rendPage(dataBox)
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

	//查询
    $('#search').on('click',function(){
		getData();
    });
    //返回
	$('#backdate').on('click',function(){
		$('#create-time').val('');
		$('#plat-title').val('');
		pageNum = 1;
		getData();
	})
});


