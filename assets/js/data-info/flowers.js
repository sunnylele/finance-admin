var index;
var pageNum = 1;
var dataBox;
var dataBox1;
var flowerUser;

if(sessionStorage.manager == undefined ){
	window.location.replace("./../../login.html");
}

//主题列表数据
function dataThemeList(v){

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
		+	'<td class="userNameColor">'+v.create_user+'</td>'
		+	'<td>'+v.name+'</td>'
		+	'<td>'
		+		'<img src="'+v.background_pic+'" alt="" width="50" />'
		+	'</td>'
		+	'<td>'+v.type+'</td>'
		+	'<td>'+v.pay+'</td>'
		+	'<td>'+v.price+'</td>'
		+	'<td>'+v.create_date+'</td>'
		+	'<td>'
		+		'<button type="button" class="btn btn-info btn-xs themeInfo" look-id="'+v.id+'">查看花名</button>'
		+		'<a class="pink" href="#" change-id="'+v.id+'">'
		+			'<i class="icon-pencil"></i>'
		+		'</a>'
		+		'<a class="red" href="#" data-Id="'+v.id+'">'
		+			'<i class="icon-trash bigger-130"></i>'
		+		'</a>'
		+	'</td>'
		+'</tr>').appendTo('.themeList #getThemeList');

	//判断状态是否正常
	if(v.status  == 0){
		// alert(v.status);
		$('#check_'+index).attr('checked',false);
	}else if(v.status == 1){
		// alert(v.status);
		$('#check_'+index).attr('checked',true);
	}
};

//获取主题数据
function getThemeDate(){

	var flowerUser = $('#flower-user').val();
	var data = {
		page: pageNum,
		name: flowerUser
	}
	$.ajax({
		type:'GET',
		url:IPAdress+'/admin/theme/list',
		data: data,
		dataType:'json',
		cache:false,
		success:function(data){
			console.log(data);
			dataBox = data.data;
			$('.themeList #getThemeList').html('');
			$('.themeList #pages-box').html('');
			if(dataBox.list == 0){
				$('<tr><td colspan="11">暂无匹配数据</td></tr>').appendTo('.themeList #getThemeList');
				return;
			}else{
				index=(dataBox.pageNum-1)*20;
				$.each(dataBox.list,function(i,v){
					index++;
					dataThemeList(v);
				});
				rendPage(dataBox);
			}
		},
		error:function(data){
		    alert(data.status);
		}
	});
};

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

$(function(){

	str = sessionStorage.manager;
    obj = JSON.parse(str);
    var master = obj.userName;
    //console.log(master)

    $('#master').html(master);

	getThemeDate();

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
		getThemeDate();
	});
	//下一页
	$('#pages-box').on('click','li.next',function(){
		if(nextPage==0){
			pageNum=totalPages;
			return;
		}else{
			pageNum = nextPage;
		}
		getThemeDate();
	});
	//上一页
	$('#pages-box').on('click','li.prve',function(){
		pageNum = prePage;
		if(pageNum < 1){
			pageNum=1;
			return;
		}else{
			getThemeDate();
		}
	});

	//单个删除
	$('tbody').on('click','.red',function(event){
		var Id=$(this).attr("data-Id");
  		layer.confirm('你确定要删除此信息吗？', {
		  	btn: ['确定','取消']
		}, function(){
		  	$.ajax({
		     	type:'DELETE',
		        url:IPAdress+'/admin/theme/delete/'+Id,
		        cache:false,
		        dataType:'json',
		        success:function(data){
		         	getThemeDate();
		         	layer.msg('删除成功', {icon: 1});
		        },
		        error:function(data){
		        	alert(data.status);
		        }
	     	});
		}, function(){

		});
	});

    //添加
	$('#addThemeData').on('click',function(){
		$("#addDate-theme").modal('show');
		$(".modal-body :input").not('input[type = "button" ]').val('');
		str = sessionStorage.manager;
		obj = JSON.parse(str);
		var masterId = obj.id;
		$('#createUserId').val(masterId);

		$('#upThemeImg').change( function() {
			$('#themeForm').ajaxSubmit({
			    type: 'POST',
			    url: IPAdress+'/upload',
				dataType : 'json',
		        success: function(data) {
		            console.log(data);
		            $('#themeImgSrc').val(data.data.path);
		        }
		    });
			return false;
		});

		$('#addTheme').on('click',function(){
			$.ajax({
				type:'POST',
				url:IPAdress+'/admin/theme/saveTheme',
				dataType:'json',
	        	data:$('#addThemeForm').serialize(),
				success:function(data){
					getThemeDate();
					$("#addDate-theme").modal('hide');
				},
				error:function(data){
				    alert(data.status);
				}
			});
		})
	});

	//选取图片
	$('#upThemeImg').on('change',function(){
		selectionImg($(this));
	});

    //修改
    var changeId = -1;
    $('tbody').on('click','.pink',function(){
    	$('#update-flower').modal('show');
    	changeId = $(this).attr("change-id");
    	$.ajax({
    		type:'GET',
			url:IPAdress+'/admin/theme/'+changeId,
			datype:'json',
			cache:'false',
			success:function(data){
				console.log(data)
				$('#createUser').html(data.data.createUser);
				$('#createDate').html(toTime(data.data.createDate));
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
			url:IPAdress+'/admin/theme/update/'+changeId,
			data:$('#updateFlowerForm').serialize(),
			dataType:'json',
			success:function(data){
				getThemeDate();
	         	$('#update-flower').modal('hide');
			},
			error:function(data){
			    alert(data.status);
			}
		})
	});

    //查询
    $('#searchTheme').on('click',function(){
    	getThemeDate();
    });
    //返回
	$('#backdate').on('click',function(){
		$('#flower-user').val('');
		pageNum = 1;
		getThemeDate();
	})
});
