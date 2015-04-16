'use strict';
var CEvent = function(){
  this.showWarnings = true;
  this.events = {};
};
CEvent.prototype.removeEventListener = function(cEvent, callback){
  if(this.events[cEvent]){
    for (var i = 0; i < this.events[cEvent].length; i++) {
      if(this.events[cEvent][i].toString() === callback.toString()){ 
        if(i === 0){
          this.events[cEvent].shift();
        }else if (i === this.events[cEvent].length-1){
          this.events[cEvent].pop();
        }else{
          this.events[cEvent].splice(i,1);
        }
        return undefined; 
      }
    }
  }else{
    console.warn('cEvent: tried to remove ', cEvent, '\n', cEvent,' does not exist.');
  }  
};
CEvent.prototype.addEventListener = function(cEvent, callback){
  if(!this.events[cEvent]){
    this.events[cEvent] = [];
    if(this.showWarnings){
      console.warn('cEvent: Create new event ', cEvent);
    }
  }
  for (var i = 0; i < this.events[cEvent].length; i++) {
    if(this.events[cEvent][i].toString() === callback.toString()){ 
      return undefined; 
    }
  }
  this.events[cEvent].push(callback);
};
CEvent.prototype.trigger = function(cEvent,args){
   if(this.events[cEvent]){
    for (var i = 0; i < this.events[cEvent].length; i++) {
      if(this.events[cEvent][i]){
        this.events[cEvent][i].apply(this,args);
      }
    }
  }else{
    console.warn('cEvent: tried to trigger ', cEvent, '\n', cEvent,' does not exist.');
  }   
};

module.exports = CEvent;
