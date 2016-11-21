<?php
class UniversalConnection
{
	
	var $uid=null;
	var $region=null;
	var $systemUrl=null;
	var $data=null;
	
	public static $defaultRegion='http://kvk.jointab.com/';
	public static $authType=1;
	public static $dataType='json';
	public static $appkey='appkey here';
	public static $appkeyType='apsi';
	
	public function __construct($force=true,$systemUrl=null)
	{
		if(isset($_GET['getApsi'])){echo UniversalConnection::$appkey; die();}//maybe unsecure
		@session_start();
		$this->systemUrl=($systemUrl)?$systemUrl:"http".(!empty($_SERVER['HTTPS'])?"s":"")."://".$_SERVER['SERVER_NAME'].$_SERVER['REQUEST_URI'];
		if(strstr($this->systemUrl,"?"))
		{
			preg_match("/(https*:\/\/[\/\w\d\._-]+)\?/",$this->systemUrl,$match);
			$this->systemUrl=$match[1];
		}
		if(isset($_GET['region']))$this->region=$_GET['region'];
		else $this->region=UniversalConnection::$defaultRegion;
		
		$this->data=null;
		if(isset($_GET['unilogout']))
		{
		    unset($_SESSION['unidata']);
		    unset($_SESSION['uniuid']);
		    session_destroy();
		}
		else if(isset($_SESSION['unidata']))
		{
		    if(UniversalConnection::$dataType=="json")
		    {
		        $this->data=json_decode($_SESSION['unidata'],true);
		        $this->uid=$this->data['uid'];
		    }
		}
		else if(isset($_SESSION['uniuid']))
		{
			$this->uid=$_SESSION['uniuid'];
		}
		else if(isset($_GET['cert']))
		{
		    $this->data=$this->checkCert();
		    $this->uid=$this->data['uid'];
		}
		else if(!UniversalConnection::$appkey && isset($_GET['uid']))
		{
		    $this->uid=$_GET['uid'];
		    $_SESSION['uniuid']=$this->uid;
		}
		else if($force || isset($_GET['unilogin']))
		{
		    $this->login();
		}
		UniversalConnection::sessionJob();//maybee unsecure
		if(isset($_GET['token']))
		{
		    $token=$_GET['token'];
		    if($token!=$this->token)
		    {
		        $this->logout();
		    }
		}
		
		if($this->data)
		{
		    $this->uid=$this->data['uid'];
		}
	}
	
	public function login()
	{
		
		if($this->region)
		{
		    if(UniversalConnection::$appkey)
		        header("location: ".$this->region."?apsi=".rawurlencode(UniversalConnection::$appkey)."&auth=".UniversalConnection::$authType."&forwardUrl=$this->systemUrl");
		    else
		        header("location: ".$this->region."?auth=".UniversalConnection::$authType."&forwardUrl=$this->systemUrl");
		    die();
		}
	}
	public function logout()
	{
		
		@session_start();
		unset($_SESSION['uniuid']);
		unset($_SESSION['uniregion']);
		unset($_SESSION['unitoken']);
		unset($_SESSION['unilang']);
		unset($_SESSION['unidevice']);
		unset($_SESSION['uniprofile']);
		@session_destroy();
	}
	
	public static function checkCert()
	{
		
		$server=UniversalServer::getServer(0,$_GET['hub']);
		$url=$server->url."client/cert/getData/?apsi=".rawurlencode(UniversalConnection::$appkey)."&cert=".rawurlencode($_GET['cert'])."&dataType=".UniversalConnection::$dataType;
		
		$ch=curl_init($url);
		curl_setopt($ch,CURLOPT_RETURNTRANSFER,true);
		$res=curl_exec($ch);
		curl_close($ch);
		
		if(UniversalConnection::$dataType=="json")
		{
		    $_SESSION['unidata']=$res;
		    $arr=json_decode($res,true);
		    return $arr;
		}
	}
	public static function getButton($obj)
	{
		
		$btn="<div style=\"position:relative;%all_pointer%\" %all_click%><span style=\"position:absolute;top:0px;left:0px;background-color:#1a1a1a;color:white;line-height:30px;padding:2px 10px 2px 80px;font-size:18px;\">%cnt%</span><img style=\"position: absolute; top:0px;left:10px\" src=\"http://kvk.jointab.com/res/userButton.png\"/></div>";
		
		if($obj->uid)
		{
		    $name=$obj->data['username'];
		    if($obj->data['profile'])
		        if($obj->data['profile']['fName']!="")
		            $name=$obj->data['profile']['fName']." ".$obj->data['profile']['lName'];
		    $cnt="<span>$name&nbsp;&nbsp;</span><span onclick=\"window.location.href='$obj->systemUrl?unilogout'\" style=\"cursor:pointer\">Logout</span>";
		    $btn=str_replace("%all_pointer%","",$btn);
		    $btn=str_replace("%all_click%","",$btn);
		    $btn=str_replace("%cnt%",$cnt,$btn);
		}
		else
		{
		    $cnt="<span>Login</span>";
		    $btn=str_replace("%all_pointer%","cursor:pointer",$btn);
		    $btn=str_replace("%all_click%","onclick=\"window.location.href='$obj->systemUrl?unilogin'\"",$btn);
		    $btn=str_replace("%cnt%",$cnt,$btn);
		}
		
		return $btn;
	}
	public static function sessionJob()
	{
		if(preg_match("/\.jointab\.(com|net|org)/i",$_SERVER['HTTP_REFERER']) and isset($_REQUEST['authSession']))
		{
		    if(isset($_REQUEST['authSessionId']))session_id($_REQUEST['authSessionId']);
		    else echo session_id();
		    
		    if(isset($_REQUEST['authSessionDestroy']))session_destroy();
		    die();
		}
	}
}
?>