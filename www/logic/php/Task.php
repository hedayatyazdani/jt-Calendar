<?php
class Task
{
	
	var $id=null;
	var $index=null;
	var $title=null;
	var $color=null;
	var $start=null;
	var $end=null;
	var $uid=null;
	var $explain=null;
	var $data=null;
	var $repeat=null;
	var $project=null;
	var $failureStart=null;
	var $failureEnd=null;
	var $failureTimePercent=10;
	var $option=null;
	var $monthStamp=null;
	var $modified=null;
	
	public static $table='task';
	public static $loadingCalendar=null;
	public static $loadList=null;
	
	public function __construct( $uid, $title, $color, $start, $end, $fstart, $fend, $fpercent, $explain, $data, $repeat, $project, $option,$index=0,$id=0)
	{
		$this->id=$id?$id:0; $this->index=$index?$index:0; $this->title=$title?$title:''; $this->color=$color?$color:'ffff00'; $this->start=$start?$start:''; $this->end=$end?$end:'';
		$this->uid=$uid?$uid:'me'; $this->explain=$explain?$explain:''; $this->data=$data?$data:''; $this->repeat=$repeat?$repeat:0; $this->project=$project?$project:0;
		$this->failureStart=$fstart?$fstart:''; $this->failureEnd=$fend?$fend:''; $this->failureTimePersent=$fpercent?$fpercent:0; $this->option=$option?$option:0;
		$this->failureTimePercent=0; $this->modified=0;
	}
	
	public static function install()
	{
		global $defdb;
		$table=Task::$table;
		
		$q="create table if not exists $table(id_fl int primary key auto_increment,index_fl int,title_fl varchar(100),color_fl varchar(8),start_fl datetime,end_fl datetime,uid_fl varchar(20),rep_fl int,proj_fl int,fstart_fl datetime,fend_fl datetime,fp_fl double,opt_fl int,mod_fl int unsigned)";
		$defdb->run($q);
		$q2="create table ex_$table (id_fl int primary key,exp_fl text)";
		$defdb->run($q2);
	}
	public static function save( $o,$sync=false)
	{
		global $defdb;
		$table=Task::$table;
		
		if($o->id>0)
		{
			$q="update $table set index_fl ={$o->index},title_fl ='{$o->title}',color_fl ='{$o->color}',start_fl ='{$o->start}',end_fl ='{$o->end}',rep_fl ={$o->repeat},proj_fl ={$o->project},fstart_fl ='{$o->failureStart}',fend_fl ='{$o->failureEnd}',fp_fl ={$o->failureTimePercent},opt_fl ={$o->option}, mod_fl=$o->modified where id_fl=$o->id and uid_fl='$o->uid'";
			$defdb->run($q);
		}
		else
		{
			$q="insert into $table (index_fl ,title_fl ,color_fl ,start_fl ,end_fl ,uid_fl ,rep_fl ,proj_fl ,fstart_fl ,fend_fl ,fp_fl ,opt_fl,mod_fl )values({$o->index}, '{$o->title}', '{$o->color}', '{$o->start}', '{$o->end}', '{$o->uid}', {$o->repeat}, {$o->project}, '{$o->failureStart}', '{$o->failureEnd}', {$o->failureTimePercent}, {$o->option},$o->modified)";
			$defdb->run($q);
			$o->id=$defdb->auto_increment;
		}
		if($o->explain){
		    $q="insert ignore into ex_$table (id_fl,exp_fl)values($o->id,'$o->explain') on duplicate key update exp_fl='$o->explain'";
		    $defdb->run($q);
		}
		else{
		    $q="delete from ex_$table where id_fl=$o->id";
		    $defdb->run($q);
		}
		
	}
	public static function search( $uid, $param, $start, $end,$dl=0,$ul=50)
	{
		global $defdb;
		$table=Task::$table;
		
		$cond=array();
		
		if($uid)array_push($cond,"uid_fl='$uid'");
		if($param)array_push($cond,"title_fl like('%$param%')");
		#(starting < task end) and (end > task start)
		if($start){
		    array_push($cond,"'$start' < end_fl");
		    array_push($cond,"'$start' < fend_fl");
		}
		if($end){
		    array_push($cond,"'$end' > start_fl");
		    array_push($cond,"'$end' > fstart_fl");
		}
		
		$cond=implode(" and ",$cond);
		if($cond!="")$cond="where $cond";
		
		$lim=($dl>=0)?"limit $dl,$ul":"";
		$q="select $table.*,ex_$table.exp_fl as exp_fl from $table left join ex_$table on $table.id_fl=ex_$table.id_fl $cond $lim";
		$defdb->run($q);
		$ret=array();
		$data=0;
		while($r=$defdb->fetch())
		{
			$tmp=
				new Task($r['uid_fl'],$r['title_fl'],$r['color_fl'],$r['start_fl'],$r['end_fl'],$r['fstart_fl'],$r['fend_fl'],$r['fp_fl'],$r['exp_fl'],$data,
				$r['rep_fl'],$r['proj_fl'],$r['opt_fl'],$r['index_fl'],$r['id_fl']);
			$tmp->modified=$r['mod_fl'];
			array_push($ret,$tmp);
		}
		return $ret;
	}
	public static function remove( $o)
	{
		global $defdb;
		$table=Task::$table;
		$q="delete from $table where id_fl=$o->id and uid_fl='$o->uid'";
		$defdb->run($q);
		$q="delete from ex_$table where id_fl=$o->id";
		$defdb->run($q);
	}
	public static function toXml( $o)
	{
		if(is_array($o))
		{
			$ret="";foreach($o as $cur)$ret.=Task::toXml($cur);return $ret;
		}
		else
			return "<Task id=\"$o->id\" index=\"$o->index\" title=\"$o->title\" color=\"$o->color\" start=\"$o->start\" end=\"$o->end\" uid=\"$o->uid\" data=\"$o->data\" repeat=\"$o->repeat\" project=\"$o->project\" failureStart=\"$o->failureStart\" failureEnd=\"$o->failureEnd\" failureTimePercent=\"$o->failureTimePercent\" option=\"$o->option\" modified=\"$o->modified\">$o->explain</Task>";
	}
	public static function parseXml( $arg)
	{
		if(gettype($arg)=="string")
		{
			$doc=new DOMDocument("1.0","utf-8");
			$doc->loadXML($arg);
			$res=$doc->getElementsByTagName("Task");
			$ret=array();
			foreach($res as $cur)
			{
				array_push($ret,
					Task::parseXml($cur)
				);
			}
			return $ret;
		}
		else
		{
		    $explain="";
		    foreach($arg->childNodes as $node){
		        if($node->nodeType==3){
		            if($explain)$explain.="\r\n";
		            $explain.=$node->nodeValue;
		        }
		    }
			$tmp=new Task($arg->getAttribute("uid"),$arg->getAttribute("title"),$arg->getAttribute("color"),$arg->getAttribute("start"),$arg->getAttribute("end"),
		    	$arg->getAttribute("failureStart"),$arg->getAttribute("failureEnd"),$arg->getAttribute("failureTimePercent"),$explain,$arg->getAttribute("data"),
		    	$arg->getAttribute("repeat"),$arg->getAttribute("project"),$arg->getAttribute("option"),$arg->getAttribute("index"),$arg->getAttribute("id"));
		    $tmp->modified=$arg->getAttribute('modified');
		    return $tmp;
		}
	}
	
	/*public class IDB
	{
		
		var $callback=null;
		var $allowInsync=false;
		
		public static $cursorIndex=0;
		public static $syncingList=null;
	}*/
}
?>