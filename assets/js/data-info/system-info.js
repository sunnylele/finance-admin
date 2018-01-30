var index;
var pageNum = 1;
var dataBox;
var titleInfo;
var creatTime;

if(sessionStorage.manager == undefined ){
	window.location.replace("./../../login.html");
}

//列表数据
function dataList(v){
	if(v.imageUrl == '' || v.imageUrl == null){
		v.imageUrl = 'http://wx.qlogo.cn/mmopen/57VrUC5owrBtZg7PUw1Ayx'
		         +'YhibIFbz4so2juicnxliclPk0rFzGyhIZUMLiaznAhO6UrUk6MIB4DQP6ibZHm7Ca2dz3u8BXc0TSxU/0';
	}else{
		v.imageUrl = v.imageUrl;
	};

	if(v.type == 0){
		v.type = '普通系统消息';
	}else if(v.type == 1){
		v.type = '通知';
	}else if(v.type == 2){
		v.type = '个人消息';
	}else{
		v.type = v.type;
	};

	if(v.refType == 'question'){
		v.refType = '问题';
	}else if(v.refType == 'topic'){
		v.refType = '话题';
	}else if(v.refType == 'article'){
		v.refType = '微博';
	}else if(v.refType == 'guanzhu'){
		v.refType = '话题关注';
	}else if(v.refType == 'dingyue'){
		v.refType = '咨询订阅';
	}else if(v.refType == 'compere'){
		v.refType = '话题主持人';
	}else{
		v.refType = v.refType;
	}

	if(v.isRead == 0){
		v.isRead = '已读';
	}else if(v.isRead == 1){
		v.isRead = '未读';
	}else{
		v.isRead = v.isRead;
	}

	$(   '<tr>'
		+	'<td>'
		+		'<label>'
		+			'<input type="checkbox" class="ace" id="every" value="'+v.id+'">'
		+			'<span class="lbl"></span>'
		+		'</label>'
		+    '</td>'
		+	'<td>'+index+'</td>'
		+	'<td>'+v.nick_name+'</td>'
		+	'<td class="textLeft">'+v.title+'</td>'
		+	'<td>'
		+		'<img class="headImg" src="'+v.imageUrl+'" alt="" width="25" />'
		+		'<b class="zoomImg"><img src="'+v.imageUrl+'"/></b>'
		+	'</td>'
		+	'<td class="textLeft">'+v.content+'</td>'
		+	'<td>'+v.link_url+'</td>'
		+	'<td>'+toTime(v.create_date)+'</td>'
		+	'<td>'+v.type+'</td>'
		+	'<td>'+v.ref_id+'</td>'
		+	'<td>'+v.ref_type+'</td>'
		+	'<td>'+v.is_read+'</td>'
		+'</tr>').appendTo('tbody');
};

function getData(){
	titleInfo = $('#title-info').val();
	creatTime = $('#creat-time').val();
	var data = {
		page: pageNum,
		title: titleInfo,
		createDate: creatTime
	}
	$.ajax({
		type:'GET',
		url:IPAdress+'/admin/message/list',
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


	//查询
	$('#search').on('click',function(){
    	getData();
    });
    //返回
	$('#backdate').on('click',function(){
		$('#title-info').val('');
    	$('#creat-time').val('');
    	pageNum = 1;
		getData();
	});
});


