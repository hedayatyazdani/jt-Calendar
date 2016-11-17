<?php
class Aniversary
{
	
	var $calendar=null;
	var $option=null;
	var $title=null;
	var $explain=null;
	var $location=null;
	var $id=null;
	var $owner=null;
	var $date=null;
	
	public static $table='anniversary_tb';
	public static $activeObject=null;
	public static $momentUI=null;
	public static $loadLevel=0;
	public static $loadingCalendar=null;
	public static $loadCallback=null;
	public static $loadUpper=false;
	
	public function __construct( $owner, $cal, $option, $title, $explain, $loc, $_date, $id)
	{
		$this->calendar=$cal?$cal:1; $this->option=$option?$option:0; $this->title=$title?$title:''; $this->explain=$explain?$explain:''; $this->location=$loc?$loc:0; $this->id=$id?$id:0;
		$this->owner=$owner?$owner:''; $this->date=$_date?$_date:'';
	}
	
	public static function install()
	{
		global $defdb;
		$table=Aniversary::$table;
		
		$q="create table if not exists $table(id_fl int primary key auto_increment, owner_fl varchar(20), cal_fl tinyint, opt_fl tinyint unsigned, title_fl varchar(20), exp_fl text, loc_fl int, date_fl datetime)";
		$defdb->run($q);
	}
	public static function save( $o)
	{
		global $defdb;
		$table=Aniversary::$table;
		
		if($o->id!=0)
		{
			$q="update $table set cal_fl ={$o->calendar},opt_fl ={$o->option},title_fl ='{$o->title}',exp_fl ='{$o->explain}',loc_fl ={$o->location},date_fl ='{$o->date}' where id_fl=$o->id";
			$defdb->run($q);
		}
		else
		{
			$q="insert into $table (cal_fl ,opt_fl ,title_fl ,exp_fl ,loc_fl ,owner_fl ,date_fl )values( {$o->calendar}, {$o->option}, '{$o->title}', '{$o->explain}', {$o->location}, '{$o->owner}', '{$o->date}')";
			$defdb->run($q);
			$o->id=$defdb->auto_increment;
		}
		
	}
	public static function search( $owner, $param, $calendar, $similar, $min, $max,$dl=0,$ul=100)
	{
		global $defdb;
		$table=Aniversary::$table;
		
		$cond=array();
		
		if($owner)array_push($cond,"(owner_fl='$owner' or owner_fl='')");//also load global anniversaries
		if($min)array_push($cond,"date_fl>'$min'");
		if($max)array_push($cond,"date_fl>'$max'");
		if($similar)array_push($cond,"date_fl like('%$similar%')");
		if($calendar)array_push($cond,"cal_fl=$calendar");
		
		$cond=implode(" and ",$cond);
		if($cond!="")$cond="where $cond";
		
		$lim=($dl>=0)?"limit $dl,$ul":"";
		$q="select * from $table $cond $lim";
		$defdb->run($q);
		$ret=array();
		while($r=$defdb->fetch())
		{
			array_push($ret,new Aniversary($r['owner_fl'],$r['cal_fl'],$r['opt_fl'],$r['title_fl'],$r['exp_fl'],$r['loc_fl'],$r['date_fl'],$r['id_fl']));
		}
		return $ret;
	}
	public static function remove( $uid, $id)
	{
		global $defdb;
		$table=Aniversary::$table;
		
		$q="delete from $table where id_fl=$id and owner_fl='$uid'";
		$defdb->run($q);
	}
	public static function toXml( $o)
	{
		if(is_array($o))
		{
			$ret="";foreach($o as $cur)$ret.=Aniversary::toXml($cur);return $ret;
		}
		else
			return "<Aniversary calendar=\"$o->calendar\" option=\"$o->option\" title=\"$o->title\" explain=\"$o->explain\" location=\"$o->location\" id=\"$o->id\" owner=\"$o->owner\" date=\"$o->date\"/>";
	}
	public static function parseXml( $arg)
	{
		if(gettype($arg)=="string")
		{
			$doc=new DOMDocument("1.0","utf-8");
			$doc->loadXML($arg);
			$res=$doc->getElementsByTagName("Aniversary");
			$ret=array();
			foreach($res as $cur)
			{
				array_push($ret,
					Aniversary::parseXml($cur)
				);
			}
			return $ret;
		}
		else
		{
			return new Aniversary($arg->getAttribute("owner"),$arg->getAttribute("calendar"),$arg->getAttribute("option"),$arg->getAttribute("title"),$arg->getAttribute("explain"),$arg->getAttribute("location"),$arg->getAttribute("date"),$arg->getAttribute("id"));
		}
	}
}
?>