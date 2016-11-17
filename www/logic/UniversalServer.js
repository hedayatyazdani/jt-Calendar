function UniversalServer(prefix,type,url)
{
	
	this.prefix=null;
	this.type=null;
	this.url=null;
this.prefix=prefix;
this.type=type;
this.url=url;
};



UniversalServer.list=null;
UniversalServer.version=null;
UniversalServer.root='/kelvok/';


UniversalServer.getServer=function(type,prefix)
{
	var keys=Object.keys(UniversalServer.list);
	if((type || type===0) && prefix)
	{
	    
	    for(var i=0;i<keys.length;i++)
	    {
	        cur=UniversalServer.list[keys[i]];
	        if(cur.type==type && cur.prefix==prefix)return cur;
	    }
	}
	else if(type>=0)
	{
	    var ret=[];
	    for(var i=0;i<keys.length;i++)
	    {
	        if(UniversalServer.list[keys[i]].type==type)ret.push(UniversalServer.list[keys[i]]);
	    }
	    return ret;
	}
};
