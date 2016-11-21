var tabContent=[];
var tabTitle=[];
var activeTab=0;
tabTitle[0]="calendar";
tabTitle[1]="task";
tabTitle[2]="setting";
//tabTitle[2]="project";
//tabTitle[3]='console';
//tabTitle[4]='help';

tabContent[0]="<script type=\"text/javascript\">selectTab("+0+");</script><div id=\"calboard\"></div>";
tabContent[1]="<script type=\"text/javascript\">selectTab("+1+");</script>";
tabContent[2]="<script type=\"text/javascript\">selectTab("+1+");</script><div id=\"settingPan\"></div>";
//tabContent[2]="<script type=\"text/javascript\">selectTab("+2+");</script>";
//tabContent[3]="<div style=\"height:120px;position:relative\" id=\"consoleParent\"></div>";
//tabContent[4]="<script type=\"text/javascript\">selectTab("+4+");</script>";

function selectTab(id)
{
	TabsCore.activeTab=id;
	if(typeof(id)=="undefined")
		selectTab(TabsCore.selectedTab);
	else
		TabsCore.selectedTab=id;
	
	cleanActionKeys();
	switch(id)
	{
	case 0:
		if(Calendar.activeObject){
			LU.clear();
			Calendar.buildForm(Calendar.activeObject,1,LU.painterArea);
		}
		addMainKey(StrRes['lastMonth'], "Calendar.previewsMonth()");
		addMainKey(StrRes['currentMonth'], "Calendar.currentMonth()");
		addMainKey(StrRes['nextMonth'], "Calendar.nextMonth()");
		addMainKey(StrRes['advanced'], "");
		addMainKey(StrRes['listMonthAniversary'], "LU.clear();");
		addMainKey(StrRes['addAniversary'], "_('#calboard').source.innerHTML='';var a=new Aniversary(); Aniversary.buildForm(a,1,'calboard')");
		break;
	case 2:
		CalSetting.buildForm(null,null,"settingPan");
		break;
	case 1:
		addMainKey(StrRes['new'], "LU.clear(); Task.helperFuse=0; var t=new Task(); Task.buildForm(t,1,LU.painterArea);");
		addMainKey(StrRes['search'], "");
		break;
	case 3:
		if (typeof(jtConsole)!="undefined") {
			addMainKey(StrRes['clear'], "jtConsole.process('clear')");
			addMainKey(StrRes['moment'], "jtConsole.process('m')");
            if (!TabsCore.buildConsole) {
                consolePan=jtConsole.buildForm('consoleParent');
				jtConsole.start();
				TabsCore.buildConsole=true;
            }
			else
			{
				_('#consoleParent').value(consolePan);
			}
        }
		break;
	case 2:
		addMainKey(StrRes['about'], "");
		addMainKey(StrRes['help'], "");
		break;
	}
}

var tabsSettingStarted=false;
function tabsSettingStart()
{
	if (!tabsSettingStarted)
	{
		//TabsCore.addDefaultAction(StrRes['create'], "Spring.Event.onCreateNewNode()");
		//TabsCore.addDefaultAction(StrRes['setAttribute'], "Spring.Event.onAttribute()");
		//TabsCore.addDefaultAction(StrRes['edit'], "Spring.Event.onEditCurrentNode(true)");
		//TabsCore.addDefaultAction(StrRes['remove'], "XmlVNode.remove(Spring.currentNode)");
		//TabsCore.addDefaultAction(StrRes['root'], "Spring.justShow(spring.root)");
		//TabsCore.addDefaultAction(StrRes['uniqueView'], "Spring.justShow(currentNode)");
		//TabsCore.addDefaultAction(StrRes['copy'], "Spring.clipBoard.copy()");
		//TabsCore.addDefaultAction(StrRes['copyMany'], "Spring.clipBoard.copyMany()");
		//TabsCore.addDefaultAction(StrRes['paste'], "Spring.clipBoard.paste()");
		//TabsCore.addDefaultAction(StrRes['swapThis'], "Spring.Event.onSwap()");
		//TabsCore.addDefaultAction(StrRes['swapWith'], "Spring.Event.onSwapWith()");
	}
}