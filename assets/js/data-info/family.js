var index;
var pageNum = 1;
var dataBox;
var conTacts;
var conTacts;

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
		+	'<td>'+v.contact_user+'</td>'
		+	'<td>'+v.mobile+'</td>'
		+	'<td class="textLeft">'+v.trust_type+'</td>'
		+	'<td>'+toTime(v.create_date)+'</td>'
		+'</tr>').appendTo('tbody');
};

//渲染数据
function getData(){
	var conTacts = $('#contacts').val();
	var createTime = $('#create-time').val();
	var data = {
		page:pageNum,
		create_date:createTime,
		contactUser:conTacts
	}
	$.ajax({
		type:'GET',
		url:IPAdress+'/admin/discovery/family/list',
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
    $('#backdate').on('click',function(){
    	$('#contacts').val('');
    	$('#createTime').val('');
    	pageNum = 1,
		getData();
	})
});


