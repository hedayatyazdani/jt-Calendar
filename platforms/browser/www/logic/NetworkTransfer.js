/*
	Author: Hedayat Yazdani
	Build : 10
	Description: javascript NetworkTransfer uses Ajax + fix escape characters -> \n
*/

var NetworkTransferList=new Array();
var NetworkTransferIndex=0;


function NetworkTransfer(target)
{
	this.target=target;//url
	this.handle=null;
	this.data=new Array();
	this.method="GET";
	this.done=false;
	this.callback=null;
	
	this.useXml=false;
	this.error=false;
	this.onerror=false;
	
	this.xml=null;
	this.text=null;
	
	
	this.index=NetworkTransferIndex;
	NetworkTransferIndex++;
	
	if(window.XMLHttpRequest)this.handle=new XMLHttpRequest();
	else if(window.ActiveXObject)this.handle=new ActiveXObject("Microsoft.XMLHTTP");
	//var contentType = "application/x-www-form-urlencoded;";
	this.clear=function(clearCallbacks)
	{
		this.data=Array();
		if(clearCallbacks)
		{
			this.callback=null;
			this.onerror=false;
		}
	};
	this.send=function()
	{
		this.done=false;
		if(this.method=="GET")
		{
			var url=this.target+"?netTrans=3";
			for(i in this.data)
			{
				url+="&"+i+"="+this.data[i];
			}
			this.handle.open("GET",url,true);
			this.handle.withCredentials=true;
			try {
                this.handle.send(null);
            } catch(e) {
                if(this.onerror)this.onerror();
            }
			
		}
		else
		{
			var urlData="netTrans=3";
			for(i in this.data)
			{
				urlData+="&"+i+"="+this.data[i];
			}
			this.handle.open("POST",this.target,true);
			this.handle.withCredentials=true;
			this.handle.setRequestHeader("Content-type", "application/x-www-form-urlencoded;charset=utf-8");// encoded charset=utf-8
			this.handle.setRequestHeader("Content-length", urlData.length);
			this.handle.setRequestHeader("Connection", "close");
			try{
				this.handle.send(urlData);
			}catch(ex){
				if(this.onerror)this.onerror();
			}
		}
		
		//this.handle.callback=this.callback;
		this.handle.ntindex=this.index;
		this.handle.onreadystatechange=function()
		{
			if(this.readyState==4 && this.status==200)
			{
				if(NetworkTransferList[this.ntindex].callback)NetworkTransferList[this.ntindex].callback(this.responseText);
				
				if(NetworkTransferList[this.ntindex].useXml)
					NetworkTransferList[this.ntindex].xml=this.responseXML;
				else
					NetworkTransferList[this.ntindex].text=this.responseText;
				
				
				NetworkTransferList[this.ntindex].done=true;
				NetworkTransferList[this.ntindex].error=false;
			}
			else if(this.readyState==4 && this.status!=200)
			{
				NetworkTransferList[this.ntindex].done=true;
				NetworkTransferList[this.ntindex].error=true;
				if(NetworkTransferList[this.ntindex].onerror)
					NetworkTransferList[this.ntindex].onerror(this.status);
			}
		};
	};
	
	this.add=function(key,value,encode)
	{
		if(encode)this.data[key]=encodeURIComponent(value);
		else this.data[key]=value;
	};
	this.openByPost=function()
	{
		form=document.getElementById("nt5lastForm");
		if(form)document.body.removeChild(form);
		
		form=document.createElement("form");
		form.setAttribute("action", this.target);
		form.setAttribute("method", "POST");
		form.setAttribute("target", "_blank");
		form.setAttribute("id", "nt5lastForm");
		for(i in this.data)
		{
			h=document.createElement("input");
			h.setAttribute("type", "hidden");
			h.setAttribute("name", i);
			h.setAttribute("value", this.data[i]);
			form.appendChild(h);
		}
		document.body.appendChild(form);
		form.submit();
	};
	NetworkTransferList[this.index]=this;
}
