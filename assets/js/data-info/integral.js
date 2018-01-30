var index;
var pageNum = 1;
var dataBox;
var nickName;
var createTime;

if(sessionStorage.manager == undefined ){
	window.location.replace("./../../login.html");
}

//列表数据
function dataList(v){

	switch(v.type){
		case 'SCDL':
			v.remark = '首次登录五路奖励100积分';
			break;
		case 'SCFB':
			v.remark = '首次发布奖励20积分';
			break;
		case 'SCPL':
			v.remark = '首次评论奖励22积分';
			break;
		case 'SCDZ':
			v.remark = '首次点赞奖励20积分';
			break;
		case 'SCSC':
			v.remark = '首次收藏奖励20积分';
			break;
		case 'SCSCTX':
			v.remark = '上传头像奖励20积分';
			break;
		case 'SCWSZL':
			v.remark = '完善资料奖励20积分';
			break;
		case 'LJGZ_10':
			v.remark = '累计关注10人奖励10积分';
			break;
		case 'LJGZ_20':
			v.remark = '累计关注20人奖励20积分';
			break;
		case 'LJGZ_50':
			v.remark = '累计关注50人奖励50积分';
			break;
		case 'LJGZ_100':
			v.remark = '累计关注100人奖励100积分';
			break;
		case 'LJFB_5':
			v.remark = '累计发布5条信息奖励10积分';
			break;
		case 'LJFB_10':
			v.remark = '累计发布10条信息奖励20积分';
			break;
		case 'LJFB_20':
			v.remark = '累计发布20条信息奖励40积分';
			break;
		case 'LJFB_50':
			v.remark = '累计发布50条信息奖励100积分';
			break;
		case 'LJDZ_20':
			v.remark = '累计点20个赞奖励10积分';
			break;
		case 'LJDZ_50':
			v.remark = '累计点50个赞奖励20积分';
			break;
		case 'LJDZ_100':
			v.remark = '累计点100个赞奖励50积分';
			break;
		case 'LJDZ_200':
			v.remark = '累计点200个赞奖励100积分';
			break;
		case 'LJPL_10':
			v.remark = '累计回应（评论）10条信息奖励10积分';
			break;
		case 'LJPL_20':
			v.remark = '累计回应（评论）20条信息奖励20积分';
			break;
		case 'LJPL_50':
			v.remark = '累计回应（评论）50条信息奖励50积分';
			break;
		case 'LJPL_100':
			v.remark = '累计回应（评论）100条信息奖励100积分';
			break;
		case 'QD_2':
			v.remark = '签到奖励2积分';
			break;
		case 'QD_5':
			v.remark = '连续5日及以上签到奖励2积分';
			break;
		case 'FB':
			v.remark = '发布一条信息奖励5积分';
			break;
		case 'FB_DEL':
			v.remark = '删除发布信息扣5积分';
			break;
		case 'PL':
			v.remark = '评论文章奖励2积分';
			break;
		case 'PL_DEL':
			v.remark = '删除评论扣2积分';
			break;
		case 'DZ':
			v.remark = '点赞文章奖励1积分';
			break;
		case 'DZ_DEL':
			v.remark = '取消点赞扣1积分';
			break;
		case 'SC':
			v.remark = '收藏文章奖励1积分';
			break;
		case 'SC_DEL':
			v.remark = '取消收藏扣1积分';
			break;
		case 'ESSENCE':
			v.remark = '发布的信息获得平台（精华）奖励50积分';
			break;
		case 'HOT':
			v.remark = '发布的信息获得平台（热帖）奖励50积分';
			break;
		case 'INCIVILIZATION_DEL':
			v.remark = '发布不文明语言内容扣50积分';
			break;
		case 'INSICNIFICANCE_DEL':
			v.remark = '发布重复无意义内容扣50积分';
			break;
		case 'COOPERATION_POSTED':
			v.remark = '达成业务合作的发帖人奖励100积分';
			break;
		case 'COOPERATION_RESPOND':
			v.remark = '达成业务合作的回应人奖励100积分';
			break;
		case 'CREATE_HEAP_DEL':
			v.remark = '创建扎堆儿消耗1000积分';
			break;
		case 'PK_HEAP_OWNER_DEL':
			v.remark = 'PK堆儿主消耗0积分';
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
		+	'<td class="userNameColor">'+v.nick_name+'</td>'
		+	'<td>'+v.type+'</td>'
		+	'<td>'+v.score_num+'</td>'
		+	'<td>'+v.deduction_num+'</td>'
		+	'<td>'+v.remark+'</td>'
		+	'<td>'+toTime(v.create_date)+'</td>'
		+	'<td>'
		+		'<a class="pink" href="#" update-id="'+v.id+'">'
		+			'<i class="icon-pencil"></i>'
		+		'</a>'
		+	'</td>'
		+'</tr>').appendTo('tbody');
};

//渲染数据
function getData(){
	var nickName = $('#users-name').val();
	var createTime = $('#create-time').val();
	data = {
		page: pageNum,
		createDate: createTime,
		nickName: nickName
	}
	$.ajax({
		type:'GET',
		url:IPAdress+'/admin/userScore/list',
		data:data,
		dataType:'json',
		cache:false,
		success:function(data){
			//console.log(data)
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

	//下一页
	$('#pages-box').on('click','li.next',function(){
		if(nextPage==0){
			pageNum=totalPages;
			return;
		}else{
			pageNum = nextPage;
		}
		getData();
	})
	//页码
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

	//修改
	var updateId = -1;
	$('tbody').on('click','td .pink',function(){
		$("#update-score").modal('show');
		updateId = $(this).attr("update-id");
		$.ajax({
			type:'GET',
			url:IPAdress+'/admin/score/'+updateId,
			datype:'json',
			cache:'false',
			success:function(data){
				console.log(data);
				$('.userId').html(data.userId);
				$('.source').html(data.type);
				loadData(data);
			},
			error:function(data){
			    alert(data.status);
			}
		});
	});
	$('#update').on('click',function(){
		$.ajax({
			type:'POST',
			url:IPAdress+'/admin/score/update/'+updateId,
			data:$('#updateScoreForm').serialize(),
			dataType:'json',
			success:function(data){
				getData();
				$("#update-score").modal('hide');
			},
			error:function(data){
			    alert(data.status);
			}
		})
	});

    $('#search').on('click',function(){
		getData();
    });
    //返回
	$('#backdate').on('click',function(){
		$('#users-name').val('');
		$('#create-time').val('');
		pageNum = 1;
		getData();
	})
});


