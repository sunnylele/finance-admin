var index;
var pageNum = 1;
var dataBox;
var advTitle;

if(sessionStorage.manager == undefined ){
	window.location.replace("./../../login.html");
}

//列表数据
function dataList(v){
	if(v.type == 1){
		v.type = '匿名吐槽';
	}else if(v.type == 2){
		v.type = '实名动态';
	}else if(v.type == 3){
		v.type = '名人堂';
	}else if(v.type == 4){
		v.type = '家族财富';
	}else if(v.type == 5){
		v.type = '认证';
	}else if(v.type == 6){
		v.type = '砸蛋换花名';
	}

	$(   '<tr>'
		+	'<td>'
		+		'<label>'
		+			'<input type="checkbox" class="ace" id="every" value="'+v.id+'">'
		+			'<span class="lbl"></span>'
		+		'</label>'
		+    '</td>'
		+	'<td>'+index+'</td>'
		+	'<td>'+v.title+'</td>'
		+	'<td>'+v.type+'</td>'
		+	'<td>'
		+		'<img src="'+v.image_url+'" alt="" width="200" />'
		+	'</td>'
		+	'<td>'
		+		'<img src="'+v.image_moible_url+'" alt="" width="200" />'
		+	'</td>'
		+	'<td>'+v.sort_no+'</td>'
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
function advData(){
	var advTitle = $('#adv-title').val();
	var data = {
		page: pageNum,
		title: advTitle
	}
	$.ajax({
		type:'GET',
		url:IPAdress+'/admin/adv/list',
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

	advData();

	//点击页码
	$('#pages-box').on('click','li.pageA',function(){
		if($(this).attr('id') == 'active_1'){
			thisNum = 1;
		}else if($(this).attr('id') == 'active_'+totalPages){
			thisNum=totalPages;
		}else{
			thisNum = $(this).find('a').text();
		}
		pageNum = thisNum;
		advData();
	});
	//下一页
	$('#pages-box').on('click','li.next',function(){
		if(nextPage == 0){
			pageNum=totalPages;
			return;
		}else{
			pageNum = nextPage;
		}
		advData();
	});
	//上一页
	$('#pages-box').on('click','li.prve',function(){
		pageNum = prePage;
		if(pageNum < 1){
			pageNum = 1;
			return;
		}else{
			advData();
		}
	})

	//添加
	$('.user-add').on('click',function(){
		$("#addDate-adv").modal('show');
		$(".modal-body :input").not('input[type = "submit" ]').val('');

		$('#pcFileImg').change( function() {
			$('#pcImgForm').ajaxSubmit({
			    type: 'POST',
			    url: IPAdress+'/upload',
				dataType : 'json',
		        success: function(data) {
		            console.log(data);
		            $('#upPcimgSrc').val(data.data.path);
		        }
		    });
			return false;
		});

		$('#mobileImg').change( function() {
			$('#phoneImgForm').ajaxSubmit({
			    type: 'POST',
			    url: IPAdress+'/upload',
				dataType : 'json',
		        success: function(data) {
		            console.log(data);
		            $('#upMobileimgSrc').val(data.data.path);
		        }
		    });
		    return false;
		});

		$('#add-adv').on('click',function(){
			$.ajax({
				type:'POST',
				url:IPAdress+'/admin/adv/add',
				dataType:'json',
	        	data:$('#addAdvForm').serialize(),
				success:function(data){
					advData();
					$("#addDate-adv").modal('hide');
				},
				error:function(data){
				    alert(data.status);
				}
			});
		})
	});

	//选取图片
	function selectionImg(el){
		var fileList = el.prop('files');
		var imgUrl = window.URL.createObjectURL(fileList[0]);
		if(el.parent().prev().find('img').length){
			el.parent().prev().find('img').attr('src',imgUrl);
		}else{
			var creteImg = $('<img />');
			creteImg.attr('src',imgUrl);
			el.parent().prev().append(creteImg);
		}
	}
	$('#pcFileImg').on('change',function(){
		selectionImg($(this));
	});
	$('#mobileImg').on('change',function(){
		selectionImg($(this));
	});

	//删除
	$('tbody').on('click','.red',function(event){
		var id=$(this).attr("del-Id");
  		layer.confirm('你确定要删除此信息吗？', {
		  	btn: ['确定','取消']
		}, function(){
		  	$.ajax({
		     	type:'DELETE',
		        url:IPAdress+'/admin/adv/delete/'+id,
		        cache:false,
		        dataType:'text',
		        success:function(data){
		         	advData();
		         	layer.msg('删除成功', {icon: 1});
		        },
		        error:function(data){
		        	alert(data.status);
		        }
	     	});
		}, function(){

		});
	});

	$('#search').on('click',function(){
    	advData();
    })

    //返回
	$('#backdate').on('click',function(){
		$('#adv-title').val('');
		pageNum = 1;
		advData();
	})
});


