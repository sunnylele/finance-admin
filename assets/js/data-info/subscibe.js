var index;
var pageNum = 1;
var dataBox;
var phoneTel;
var orderNum;
var createTime;

if(sessionStorage.manager == undefined ){
	window.location.replace("./../../login.html");
}

//列表数据
function dataList(v){

	if(v.pay_status == 'dz'){
		v.pay_status = '待支付';
	}else if(v.pay_status == 'df'){
		v.pay_status = '待发货';
	}else if(v.pay_status == 'ds'){
		v.pay_status = '待收货';
	}else if(v.pay_status == 'dp'){
		v.pay_status = '待评价';
	}

	if(v.send_status == 0){
		v.send_status = '否';
	}else if(v.send_status == 1){
		v.send_status = '是';
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
		+	'<td>'+v.order_no+'</td>'
		+	'<td>'+v.receiver+'</td>'
		+	'<td>'+v.mobile+'</td>'
		+	'<td class="cont" news-id="'+v.id+'">'+v.address+'</td>'
		+	'<td>'+v.pay_status+'</td>'
		+	'<td>'+v.actual_price+'</td>'
		+	'<td>'+toTime(v.pay_date)+'</td>'
		+	'<td>'+v.waybill_company+'</td>'
		+	'<td>'+v.waybill_no+'</td>'
		+	'<td>'+v.send_status+'</td>'
		// +	'<td>'
		// +		'<a class="pink" href="#" change-Id="'+v.id+'">'
		// +			'<i class="icon-pencil"></i>'
		// +		'</a>'
		// +		'<a class="red" href="#" del-Id="'+v.id+'">'
		// +			'<i class="icon-trash bigger-130"></i>'
		// +		'</a>'
		// +	'</td>'
		+'</tr>').appendTo('tbody');
};

//渲染数据
function getData(){
	phoneTel = $('#phoneTel').val();
	orderNum = $('#orderNum').val();
	createTime = $('#createTime').val();
	var data={
		page:pageNum,
		mobile:phoneTel,
		orderNo:orderNum,
		payDate:createTime
	}
	$.ajax({
		type:'GET',
		url:IPAdress+'/admin/subscibe/list',
		data: data,
		dataType:'json',
		cache:false,
		success:function(data){
			//console.log(data);
			dataBox = data.data;
			$('tbody').html('');
			$('#pages-box').html('');
			if(dataBox.list == 0){
				$('<tr><td colspan="13">暂无匹配数据</td></tr>').appendTo('tbody');
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

	//详情
    $('tbody').on('click','td.cont',function(){
    	$('#post-details').modal('show');
    	var newsId = $(this).attr("news-id");
    	$.ajax({
    		type:'GET',
			url:IPAdress+'/admin/subscibe/orderinfo/'+newsId,
			datype:'json',
			cache:'false',
			success:function(data){
				console.log(data);
				$('.xm').html(data.data.receiver);
				$('.dh').html(data.data.mobile);
				$('.dz').html(data.data.address);
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
	 	phoneTel = $('#phoneTel').val('');
		orderNum = $('#orderNum').val('');
		createTime = $('#createTime').val('');
	 	pageNum = 1;
		getData();
	});
});


