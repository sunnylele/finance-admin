
var index;
var pageNum = 1;
var dataBox;
var relTime;
var backCon;
var fbUserName;

if(sessionStorage.manager == undefined ){
	window.location.replace("./../../login.html");
}

//列表数据
function dataList(v){

	if(v.create_date != null){
		v.create_date = toTime(v.create_date);
	}else{
		v.create_date = ''
	}

	$(   '<tr>'
		+	'<td>'
		+		'<label>'
		+			'<input type="checkbox" class="ace" id="every" value="'+v.id+'">'
		+			'<span class="lbl"></span>'
		+		'</label>'
		+    '</td>'
		+	'<td>'+index+'</td>'
		+	'<td class="userNameColor">'+v.nick_name+'</td>'
		+	'<td class="textLeft">'+v.content+'</td>'
		+	'<td>'+v.create_date+'</td>'
		+'</tr>').appendTo('tbody');
};

//渲染数据
function getData(){
	var fbUserName = $('#fbUserName').val();
	var relTime = $('#rel-time').val();
	var backCon = $('#back-con').val();
	var data = {
		page: pageNum,
		createDate: relTime,
		content: backCon
	}
	$.ajax({
		type:'GET',
		url:IPAdress+'/admin/feedback/list',
		data: data,
		dataType:'json',
		cache:false,
		success:function(data){
			//console.log(data);
			dataBox = data.data;
			$('tbody').html('');
			$('#pages-box').html('');
			if(dataBox.list == 0){
				$('<tr><td colspan="5">暂无匹配数据</td></tr>').appendTo('tbody');
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


var Feedback =  {

	searchData:function(){
		$('#search').off('click').on('click',function(){
			getData();
	    });
	},
	backHome:function(){
	    $('#backdate').on('click',function(){
	    	$('#fbUserName').val('');
	    	$('#rel-time').val('');
	    	$('#back-con').val('');
	    	pageNum = 1;
			getData();
		})
	},
	queryClickPageNO:function(){
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
	},
	nextPage:function(){
		$('#pages-box').on('click','li.next',function(){
			if(nextPage==0){
				pageNum=totalPages;
				return;
			}else{
				pageNum = nextPage;
			}
			getData();
		});
	},
	prePage:function(){
		$('#pages-box').on('click','li.prve',function(){
			pageNum = prePage;
			if(pageNum < 1){
				pageNum=1;
				return;
			}else{
				getData();
			}
		});
	}

}




$(function(){

	str = sessionStorage.manager;
    obj = JSON.parse(str);
    var master = obj.userName;
    //console.log(master)

    $('#master').html(master);

	//获取列表数据
	getData();
	//点击页码
	Feedback.queryClickPageNO();
	//下一页
	Feedback.nextPage();
	//上一页
	Feedback.prePage();
	//查询
	Feedback.searchData();
	//返回首页
	Feedback.backHome();
});


