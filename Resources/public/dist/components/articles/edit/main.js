define(["jquery","underscore","config","services/husky/util","services/suluarticle/article-manager","services/suluarticle/article-router","sulusecurity/services/user-manager","sulusecurity/services/security-checker","sulucontent/components/copy-locale-overlay/main","sulucontent/components/open-ghost-overlay/main","services/sulucontent/smart-content-manager","./adapter/article","./adapter/article-page"],function(a,b,c,d,e,f,g,h,i,j,k,l,m){"use strict";var n={headerRightSelector:".right-container"},o={resourceLocatorAlreadyExists:1103};return{defaults:{options:{page:1,config:{}},templates:{url:"/admin/api/articles<% if (!!id) { %>/<%= id %><% } %>?locale=<%= locale %>",pageSwitcher:['<div class="page-changer">','   <span class="title"><%= label %></span>','   <span class="dropdown-toggle"></span>',"</div>"].join("")},translations:{headline:"sulu_article.edit.title",draftLabel:"sulu-document-manager.draft-label",removeDraft:"sulu-content.delete-draft",unpublish:"sulu-document-manager.unpublish",unpublishConfirmTextNoDraft:"sulu-content.unpublish-confirm-text-no-draft",unpublishConfirmTextWithDraft:"sulu-content.unpublish-confirm-text-with-draft",unpublishConfirmTitle:"sulu-content.unpublish-confirm-title",deleteDraftConfirmTitle:"sulu-content.delete-draft-confirm-title",deleteDraftConfirmText:"sulu-content.delete-draft-confirm-text",copy:"sulu_article.edit.copy",deletePage:"sulu_article.edit.delete_page",pageOf:"sulu_article.edit.page-of",newPage:"sulu_article.edit.new-page",orderPage:"sulu_article.edit.order-page",page:"sulu_article.edit.page",openGhostOverlay:{info:"sulu_article.settings.open-ghost-overlay.info","new":"sulu_article.settings.open-ghost-overlay.new",copy:"sulu_article.settings.open-ghost-overlay.copy",ok:"sulu_article.settings.open-ghost-overlay.ok"},copyLocaleOverlay:{info:"sulu_article.settings.copy-locale-overlay.info"}}},layout:function(){return{navigation:{collapsed:!0},content:{shrinkable:!!this.options.id},sidebar:!!this.options.id&&"max"}},header:function(){var a={},d={},e={};return h.hasPermission(this.data,"edit")&&(e.saveDraft={},h.hasPermission(this.data,"live")&&(e.savePublish={},e.publish={}),c.has("sulu_automation.enabled")&&(e.automationInfo={options:{entityId:this.options.id,entityClass:"Sulu\\Bundle\\ArticleBundle\\Document\\ArticleDocument",handlerClass:["Sulu\\Bundle\\ContentBundle\\Automation\\DocumentPublishHandler","Sulu\\Bundle\\ContentBundle\\Automation\\DocumentUnpublishHandler"]}}),a.save={parent:"saveWithDraft",options:{callback:function(){this.sandbox.emit("sulu.toolbar.save","publish")}.bind(this),dropdownItems:e}},a.template={options:{dropdownOptions:{url:"/admin/articles/templates?type="+(this.options.type||this.data.articleType),callback:function(a){this.template=a.template,this.sandbox.emit("sulu.tab.template-change",a),this.setHeaderBar()}.bind(this)}}}),h.hasPermission(this.data,"live")&&(d.unpublish={options:{title:this.translations.unpublish,disabled:!this.data.published,callback:this.unpublish.bind(this)}},d.divider={options:{divider:!0}}),h.hasPermission(this.data,"delete")&&(d["delete"]={options:{disabled:!this.options.id,callback:this.deleteArticle.bind(this)}},d.deletePage={options:{title:this.translations.deletePage,disabled:!this.options.page||1===this.options.page,callback:this.deleteArticlePage.bind(this)}}),d.copyLocale={options:{title:this.sandbox.translate("toolbar.copy-locale"),callback:function(){i.startCopyLocalesOverlay.call(this,this.translations.copyLocaleOverlay).then(function(a){return b.contains(a,this.options.locale)?void this.toEdit(this.options.locale):(this.data.concreteLanguages=b.uniq(this.data.concreteLanguages.concat(a)),void this.sandbox.emit("sulu.labels.success.show","labels.success.copy-locale-desc","labels.success"))}.bind(this))}.bind(this)}},h.hasPermission(this.data,"edit")&&(d.copy={options:{title:this.translations.copy,callback:this.copy.bind(this)}}),this.sandbox.util.isEmpty(d)||(a.edit={options:{dropdownItems:d}}),a.statePublished={},a.stateTest={},{tabs:{url:"/admin/content-navigations?alias=article&id="+this.options.id+"&locale="+this.options.locale+(this.options.page?"&page="+this.options.page:""),options:{data:function(){return this.sandbox.util.deepCopy(this.data)}.bind(this),url:function(){return this.templates.url({id:this.options.id,locale:this.options.locale})}.bind(this),config:this.options.config,preview:this.preview,adapter:this.getAdapter(),page:this.options.page,id:this.options.id},componentOptions:{values:b.defaults(this.data,{type:null})}},toolbar:{buttons:a,languageChanger:{data:this.options.config.languageChanger,preSelected:this.options.locale}}}},initialize:function(){this.$el.addClass("article-form"),k.initialize(),this.startPageSwitcher(),this.bindCustomEvents(),this.showDraftLabel(),this.setHeaderBar(!0),this.loadLocalizations(),this.options.language=this.options.locale},bindCustomEvents:function(){this.sandbox.on("sulu.header.back",this.toList.bind(this)),this.sandbox.on("sulu.tab.dirty",this.setHeaderBar.bind(this)),this.sandbox.on("sulu.toolbar.save",this.save.bind(this)),this.sandbox.on("sulu.tab.data-changed",this.setData.bind(this)),this.sandbox.on("sulu.article.error",this.handleError.bind(this)),this.sandbox.on("husky.tabs.header.item.select",this.tabChanged.bind(this)),this.sandbox.on("sulu.header.language-changed",this.languageChanged.bind(this))},languageChanged:function(a){if(a.id!==this.options.locale){this.sandbox.sulu.saveUserSetting(this.options.config.settingsKey,a.id);var c=this.getAdapter().prepareData(this.data,this);-1===b(c.concreteLanguages).indexOf(a.id)?j.openGhost.call(this,c,this.translations.openGhostOverlay).then(function(b,d){b?i.copyLocale.call(this,c.id,d,[a.id],function(){this.toEdit(a.id)}.bind(this)):this.toEdit(a.id)}.bind(this)).fail(function(){this.sandbox.emit("sulu.header.change-language",this.options.language)}.bind(this)):this.toEdit(a.id)}},tabChanged:function(a){this.options.content=a.id},handleError:function(a,b,c,d){switch(b){case o.resourceLocatorAlreadyExists:this.sandbox.emit("sulu.labels.error.show","labels.error.content-save-resource-locator","labels.error"),this.sandbox.emit("sulu.header.toolbar.item.enable","save");break;default:this.sandbox.emit("sulu.labels.error.show","labels.error.content-save-desc","labels.error"),this.sandbox.emit("sulu.header.toolbar.item.enable","save")}},deleteArticle:function(){this.sandbox.sulu.showDeleteDialog(function(a){a&&e.remove(this.options.id,this.options.locale).then(function(){this.toList()}.bind(this))}.bind(this))},deleteArticlePage:function(){this.sandbox.sulu.showDeleteDialog(function(a){if(a){var b=this.getAdapter().prepareData(this.data,this);e.removePage(this.options.id,b.id,this.options.locale).then(function(){f.toEditForce(this.options.id,this.options.locale)}.bind(this))}}.bind(this))},toEdit:function(a,b){return this.options.page&&1!==this.options.page?f.toPageEdit(b||this.options.id,this.options.page,a||this.options.locale):void f.toEdit(b||this.options.id,a||this.options.locale,this.options.content)},toList:function(a){f.toList(a||this.options.locale,this.options.type||this.data.articleType)},toAdd:function(a){f.toAdd(a||this.options.locale,this.options.type||this.data.articleType)},save:function(a){this.loadingSave(),this.saveTab(a).then(function(b){this.saved(b.id,b,a)}.bind(this))},setData:function(a){this.data=a},saveTab:function(c){var d=a.Deferred();return this.sandbox.emit("sulu.header.toolbar.item.loading","save"),this.sandbox.once("sulu.tab.saved",function(a,c){d.resolve(b.defaults(c,{type:null}))}.bind(this)),this.sandbox.emit("sulu.tab.save",c),d},setHeaderBar:function(a){var b=!a,c=!a,d=!!a&&!this.data.publishedState;this.setSaveToolbarItems.call(this,"saveDraft",b),this.setSaveToolbarItems.call(this,"savePublish",c),this.setSaveToolbarItems.call(this,"publish",d),this.setSaveToolbarItems.call(this,"unpublish",!!this.data.published),b||c||d?this.sandbox.emit("sulu.header.toolbar.item.enable","save",!1):this.sandbox.emit("sulu.header.toolbar.item.disable","save",!1),this.showState(!!this.data.published)},setSaveToolbarItems:function(a,b){this.sandbox.emit("sulu.header.toolbar.item."+(b?"enable":"disable"),a,!1)},loadingSave:function(){this.sandbox.emit("sulu.header.toolbar.item.loading","save")},afterSaveAction:function(a){"back"===a?this.toList():"new"===a?this.toAdd():this.options.id?this.options.page||f.toPageEdit(this.data.id,this.data._embedded.pages.length+1,this.options.locale):this.toEdit(this.options.locale,this.data.id)},showDraftLabel:function(){this.sandbox.emit("sulu.header.tabs.label.hide"),this.hasDraft(this.data)||g.find(this.data.changer).then(function(a){this.sandbox.emit("sulu.header.tabs.label.show",this.sandbox.util.sprintf(this.translations.draftLabel,{changed:this.sandbox.date.format(this.data.changed,!0),user:a.username}),[{id:"delete-draft",title:this.translations.removeDraft,skin:"critical",onClick:this.deleteDraft.bind(this)}])}.bind(this))},deleteDraft:function(){this.sandbox.sulu.showDeleteDialog(function(a){a&&(this.sandbox.emit("husky.label.header.loading"),e.removeDraft(this.data.id,this.options.locale).always(function(){this.sandbox.emit("sulu.header.toolbar.item.enable","edit")}.bind(this)).then(function(a){f.toEdit(this.options.id,this.options.locale),this.saved(a.id,a)}.bind(this)).fail(function(){this.sandbox.emit("husky.label.header.reset"),this.sandbox.emit("sulu.labels.error.show","labels.error.remove-draft-desc","labels.error")}.bind(this)))}.bind(this),this.translations.deleteDraftConfirmTitle,this.translations.deleteDraftConfirmText)},hasDraft:function(a){return!a.id||!!a.publishedState||!a.published},getUrl:function(a){var c=b.template(this.defaults.templates.url,{id:this.options.id,locale:this.options.locale});return a&&(c+="&action="+a),c},loadComponentData:function(){if(!this.options.id)return{_embedded:{pages:[]}};var b=a.Deferred();return this.sandbox.util.load(this.getUrl()).done(function(a){this.preview=this.getAdapter().startPreview(this,a),b.resolve(a)}.bind(this)),b},getAdapter:function(){return this.adapter?this.adapter:this.adapter=1===this.options.page?l:m},destroy:function(){this.preview&&this.getAdapter().destroyPreview(this.preview),this.$dropdownElement&&this.sandbox.stop(this.$dropdownElement)},showState:function(a){a&&!this.data.type?(this.sandbox.emit("sulu.header.toolbar.item.hide","stateTest"),this.sandbox.emit("sulu.header.toolbar.item.show","statePublished")):(this.sandbox.emit("sulu.header.toolbar.item.hide","statePublished"),this.sandbox.emit("sulu.header.toolbar.item.show","stateTest"))},unpublish:function(){this.sandbox.sulu.showConfirmationDialog({callback:function(a){a&&(this.sandbox.emit("sulu.header.toolbar.item.loading","edit"),e.unpublish(this.data.id,this.options.locale).always(function(){this.sandbox.emit("sulu.header.toolbar.item.enable","edit")}.bind(this)).then(function(a){this.sandbox.emit("sulu.labels.success.show","labels.success.content-unpublish-desc","labels.success"),this.saved(a.id,a)}.bind(this)).fail(function(){this.sandbox.emit("sulu.labels.error.show","labels.error.content-unpublish-desc","labels.error")}.bind(this)))}.bind(this),title:this.translations.unpublishConfirmTitle,description:this.hasDraft(this.data)?this.translations.unpublishConfirmTextNoDraft:this.translations.unpublishConfirmTextWithDraft})},copy:function(){e.copy(this.data.id,this.options.locale).done(function(a){f.toEdit(a.id,this.options.locale)}.bind(this))},saved:function(a,b,c){this.setData(b),this.options.id?(this.setHeaderBar(!0),this.showDraftLabel(),this.sandbox.emit("sulu.header.saved",b),this.sandbox.emit("sulu.labels.success.show","labels.success.content-save-desc","labels.success")):this.sandbox.sulu.viewStates.justSaved=!0,this.afterSaveAction(c)},loadLocalizations:function(){this.sandbox.util.load("/admin/api/localizations").then(function(a){this.localizations=a._embedded.localizations.map(function(a){return{id:a.localization,title:a.localization}})}.bind(this))},getCopyLocaleUrl:function(a,b,c){return e.getCopyLocaleUrl(a,b,c)},startPageSwitcher:function(){var b=this.options.page,c=this.data._embedded.pages||[],e=c.length+1,g=[];b||(b=++e);for(var h=1;h<=e;h++)g.push({id:h,title:d.sprintf(this.translations.pageOf,h,e)});this.options.id&&(g=g.concat([{divider:!0},{id:"add",title:this.translations.newPage}])),c.length>1&&g.push({id:"order",title:this.translations.orderPage}),this.$dropdownElement=a(this.templates.pageSwitcher({label:d.sprintf(this.translations.pageOf,b,e)}));var i=a(n.headerRightSelector);i.prepend(this.$dropdownElement),i.addClass("wide"),this.sandbox.start([{name:"dropdown@husky",options:{el:this.$dropdownElement,instanceName:"header-pages",alignment:"right",valueName:"title",data:g,clickCallback:function(a){return"add"===a.id?f.toPageAdd(this.options.id,this.options.locale):"order"===a.id?this.orderPages():1===a.id?f.toEdit(this.options.id,this.options.locale):f.toPageEdit(this.options.id,a.id,this.options.locale)}.bind(this)}}])},orderPages:function(){var b=a("<div/>"),c=this.data._embedded.pages||[],d=this.data._pageTitlePropertyName,g=[];this.$el.append(b);for(var h=0,i=c.length;h<i;h++){var j=this.translations.page+" "+c[h].pageNumber;d&&(j=c[h][d]),g.push({id:c[h].id,title:j})}this.sandbox.start([{name:"articles/edit/page-order@suluarticle",options:{el:b,pages:g,saveCallback:function(a){return e.orderPages(this.options.id,a,this.options.locale).done(function(){f.toEditForce(this.options.id,this.options.locale,this.options.content)}.bind(this)).fail(function(){this.sandbox.emit("sulu.labels.error.show","labels.error.content-save-desc","labels.error")}.bind(this))}.bind(this)}}])}}});