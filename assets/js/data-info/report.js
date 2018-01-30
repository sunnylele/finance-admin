var index;
var pageNum = 1;
var dataBox;
var relTime;
var anonyCont;

if(sessionStorage.manager == undefined ){
	window.location.replace("./../../login.html");
}

function getList(){
	var reportTime = $('#report-time').val();
	var reportCont = $('#report-cont').val();
	var data={
		page:pageNum,
		createDate:reportTime,
		content:reportCont
	}
	$.ajax({
		type:'GET',
		url:IPAdress+'/admin/complain/list',
		data:data,
		dataType:'json',
		cache:false,
		success:function(data){
			console.log(data);
			dataBox = data.data;
			$('tbody').html('');
			$('#pages-box').html('');
			if(dataBox.list == 0){
				$('<tr><td colspan="8">暂无匹配数据</td></tr>').appendTo('tbody');
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

function dataList(v){

	switch(v.ref_type){
		case 'anonymity':
			v.ref_type = '匿名吐槽';
			break;
		case 'dynamic':
			v.ref_type = '实名动态';
			break;
		case 'wemedia':
			v.ref_type = '自媒体';
			break;
	}

	$(   '<tr>'
		+	'<td>'
		+		'<label>'
		+			'<input type="checkbox" class="ace" id="every" value="'+v.id+'">'
		+			'<span class="lbl"></span>'
		+		'</label>'
		+    '</td>'
		+	'<td>'+index+'</td>'
		+	'<td>'+v.defendant_id+'</td>'
		+	'<td>'+v.informant_id+'</td>'
		+	'<td>'+v.ref_id+'</td>'
		+	'<td>'+v.ref_type+'</td>'
		+	'<td class="textLeft">'+v.content+'</td>'
		+	'<td>'+toTime(v.create_date)+'</td>'
		+'</tr>').appendTo('tbody');
};



$(function(){

	str = sessionStorage.manager;
    obj = JSON.parse(str);
    var master = obj.userName;
    //console.log(master)

    $('#master').html(master);

	getList();
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
		getList();
	});
	//下一页
	$('#pages-box').on('click','li.next',function(){
		if(nextPage==0){
			pageNum=totalPages;
			return;
		}else{
			pageNum = nextPage;
		}
		getList();
	});
	//上一页
	$('#pages-box').on('click','li.prve',function(){
		pageNum = prePage;
		if(pageNum < 1){
			pageNum=1;
			return;
		}else{
			getList();
		}
	});

    $('#search').on('click',function(){
    	getList();
    })

    //返回
	$('#backdate').on('click',function(){
		$('#report-time').val('');
		$('#report-cont').val('');
		pageNum = 1;
		getList();
	})
});

