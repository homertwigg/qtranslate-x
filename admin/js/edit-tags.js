/* loaded in 
	/wp-admin/edit-tag.php
*/
new qTranslateX({
	addContentHooks: function(qtx)
	{
		// Get fields
		var isAjaxForm=!!qtx.ge('tag-name');
		var prefix, formId;
		if (isAjaxForm)
		{
			prefix='tag-';
			formId='addtag';
		}
		else
		{
			prefix='';
			formId='edittag';
		}
		var nameField=qtx.ge(prefix+'name');
		var form=qtx.ge(formId);
		if(!form || !nameField){
			//alert('qTranslate-X cannot hook into the tag editor.\nPlease, report this incident to the developers.');
			return false;
		}

		var adminLanguage=qTranslateConfig.language;

		build_translator=function(langF,langT)
		{
				var translator={};
				for(var key in qTranslateConfig.term_name){
					var nms = qTranslateConfig.term_name[key];
					var nmF=nms[langF];
					var nmT=nms[langT];
					if(!nmF || !nmT){
							var nmD=nms[qTranslateConfig.default_language];
							if(!nmD) continue;
							if(!nmF) nmF=nmD+'('+qTranslateConfig.default_language+')';
							if(!nmT) nmT=nmD+'('+qTranslateConfig.default_language+')';
					}
					translator[nmF]=nmT;
				}
				return translator;
		}

		var theList=qtx.ge('the-list');
		hideQuickEdit=function()
		{
			if(!theList) return;
			var rows=theList.getElementsByTagName('TR');
			for(var r=0; r<rows.length; r++)
			{
				var tr=rows[r];
				var td=tr.getElementsByTagName('TD')[0];
				var items=td.getElementsByClassName('inline');
				for(var i=0; i<items.length; ++i)
				{
					var e=items[i];
					e.style.display='none';
				}
			}
		}
		hideQuickEdit();

		//var nameFields={};
		updateNames=function(langF,langT)
		{
			if(!theList) return;
			var rows=theList.getElementsByTagName('TR');
			for(var r=0; r<rows.length; r++)
			{
				var dnm, tr=rows[r];
				var td=tr.getElementsByTagName('TD')[0];
				var divs=td.getElementsByTagName('DIV');
				for(var d=0; d<divs.length; d++)
				{
					var e=divs[d];
					if(e.className!=='name')
							continue;
					dnm=e.innerHTML;
					break;
				}
				if(adminLanguage!=qTranslateConfig.default_language){
					var translator=build_translator(adminLanguage,qTranslateConfig.default_language);
					dnm=translator[dnm];
				}
				var nms=qTranslateConfig.term_name[dnm]||{};
				var nmF = nms[langF]||'';
				var nmT = nms[langT]||'';
				var items=td.getElementsByClassName('row-title');
				for(var i=0; i<items.length; ++i)
				{
					var e=items[i];
					if(nmF)
						e.innerHTML = e.innerHTML.replace(nmF,nmT);
					else
						e.innerHTML += nmT;
				}
			}
		}

		var tagCloud=document.getElementsByClassName('tagcloud')[0];
		updateTagCloud=function(langF,langT)
		{
			if(!tagCloud) return;
			var items=tagCloud.getElementsByTagName('A');
			if(!items.length) return;
			var translator=build_translator(langF,langT);
			for(var i=0; i<items.length; ++i)
			{
				var e=items[i];
				var nmF=e.innerHTML;
				var nmT=translator[nmF];
				if(!nmT) continue;
				e.innerHTML=nmT;
			}
		}

		this.updateNamesAndTagCloud=function(langF,langT)
		{
			updateNames(langF,langT);
			updateTagCloud(langF,langT);
		}
		this.activeLanguage=qtx.getInitialLanguage();
		if(adminLanguage!==this.activeLanguage)
			this.updateNamesAndTagCloud(adminLanguage,this.activeLanguage);

		// Swap fields
		var newNameField=qtranxj_ce('input', {name: nameField.name, className: 'hidden', value: nameField.value}, form, true);
		nameField.name='';

		// Load text
		var names = qTranslateConfig.term_name[nameField.value] || {};
		if (this.activeLanguage !== qTranslateConfig.default_language){
			nameField.value=names[this.activeLanguage] || '';
		}
/*
		editinline_activated=function()
		{
			//c('editinline_activated:'+this.innerHTML);
			return true;
		}

		var editinlines=document.getElementsByClassName('editinline');
		//c('editinlines.length='+editinlines.length);
		for(var i=0; i<editinlines.length; ++i)
		{
			var e=editinlines[i];
			if(e.tagName!=='A') continue;
			e.addEventListener( 'click', editinline_activated);
		}
*/
		var langs=qTranslateConfig.enabled_languages;
		var newNameFields={};
		for(var i=0; i<langs.length; ++i)
		{
			var lang=langs[i];
			newNameFields[lang]=qtranxj_ce('input', {name: 'qtranx_term_'+lang, className: 'hidden', value: name[lang] || ''}, form, true);
		}
		// Add listeners for fields change
		nameField.onblur=function()
		{
			var lang=languageSwitch.getActiveLanguage();
			newNameFields[lang].value=this.value;
			names[lang]=this.value;
			if (lang === qTranslateConfig.default_language)
			{
				newNameField.value=this.value;
			}
		};

		this.names=names;
		this.nameField=nameField;
		//this.activeLanguage=activeLanguage;
		return true;
	}
,
	onTabSwitch: function(lang,qtx)
	{
		if(this.activeLanguage === lang) return;
		this.nameField.value=this.names[lang] || '';
		this.updateNamesAndTagCloud(this.activeLanguage,lang);
		this.activeLanguage = lang;
	}
});