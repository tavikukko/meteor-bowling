//collection for games
Games = new Meteor.Collection("games");
//Meteor.subscribe("games");
//collection for frames
Frames = new Meteor.Collection("frames");
//collection of bowling markup
FrameMarkup = new Meteor.Collection("markup");

if (Meteor.isClient) {

  //returns all games
  Template.tgames.games = function () {
    return Games.find({});
  };

Template.tgame.gameframes = function () {
  return Frames.find({gameid: this._id});
};

Template.tframe.lastframe = function () {
 return this.framenro === 10;
};

Template.tframe.isEven = function () {
 return (this.framenro%2 === 0);
};

Template.tframe.getColor = function () {
  if(this.first != 'X' && this.first != ' ' && this.second === ' ') return '#FCF7C0';
  if(this.first === ' ' || this.first === '') return '';
  if(this.first === 'X') return '#B8F5B0';
  if(this.second != '/' && this.second != ' ') return '#FA8C9E';
 return '#C0E1FC';
};

Template.tframe.getColorSecond = function () {
  if(this.second === 'X') return '#B8F5B0';
 return '';
};

Template.tframe.getColorThird = function () {
  if(this.third === 'X') return '#B8F5B0';
 return '';
};

function getMarkValue(mark)
{
  switch(mark)
  {
    case '' :
    case ' ':
    case '-':
      return 0;
      break;

    case 'X':
    case '/':
      return 10;
      break;

    default:
      return parseInt(mark);
  }
}

function updateFrame(game)
{
  //get all frames to array
  var i = 1;
  var framesInArray = new Array(10);
  Frames.find({gameid: game.gameid}).forEach(function (frame) {
    framesInArray[i] = frame;
    i++;
  });

  i = 1;
  var fpoints = 0;
  var ftotal = 0;
  //update all frames points
  Frames.find({gameid: game.gameid}).forEach(function (frame) {
      if(frame.framenro < 10)
      {
        var fFirst = getMarkValue(frame.first);
        var fSecond = getMarkValue(frame.second);
        fpoints = fFirst + fSecond;
        if(fpoints > 10) fpoints = 10;

        if(frame.second === '/' || frame.first === 'X')
        {
          var nexti;
          var pluspoint;

          nexti = framesInArray[i+1];
          pluspoint = getMarkValue(nexti.first);

          fpoints = fpoints + pluspoint;
          
          if(frame.first === 'X' && nexti.first === 'X')
          {
            var pluspoint2 = 0;
            if(frame.framenro === 9)
            {
                pluspoint2 = getMarkValue(nexti.second);
            }
            else
            {
              var nexti2 = framesInArray[i+2];
              pluspoint2 = getMarkValue(nexti2.first);
            }
            fpoints = fpoints + pluspoint2;
          }
          else if (frame.first === 'X')
          {
            var pluspoint3 = 0;
              if(nexti.second === '/')
              {
                pluspoint3 = 10 - getMarkValue(nexti.first);
              }
              else pluspoint3 = getMarkValue(nexti.second);

            fpoints = fpoints + pluspoint3;
          }
        }
      }
      else
      {
        fpoints = 0;
        var eka = 0;
        var toka = 0;
        var kolkki = 0;
        eka = getMarkValue(frame.first);
        
        if(frame.second === '/')
        {
          toka = 10 - getMarkValue(frame.first);
        }else toka = getMarkValue(frame.second);

        if(frame.third === '/')
        {
          kolkki = 10 - getMarkValue(frame.second);
        }else kolkki = getMarkValue(frame.third);
        
        fpoints = eka + toka + kolkki;
      }
      i++;

    Frames.update(frame._id, {$set: {points: ftotal+fpoints}});
    ftotal = ftotal+fpoints;
  });
}

   Template.tframe.events({
    'click .first' : function () {
      Frames.update(this._id, {$set: {second: ' '}});
      var rvalue = ' ';
      var rpnt = 0;
      if(this.first === ' ') {rvalue = 'X';}
      if(this.first === 'X') {rvalue = '9';}
      if(this.first === '9') {rvalue = '8';}
      if(this.first === '8') {rvalue = '7';}
      if(this.first === '7') {rvalue = '6';}
      if(this.first === '6') {rvalue = '5';}
      if(this.first === '5') {rvalue = '4';}
      if(this.first === '4') {rvalue = '3';}
      if(this.first === '3') {rvalue = '2';}
      if(this.first === '2') {rvalue = '1';}
      if(this.first === '1') {rvalue = '-';}
      if(this.first === '-') {rvalue = ' ';}

      Frames.update(this._id, {$set: {first: rvalue}});
      updateFrame(this);
    }
  });

   Template.tframe.events({
    'click .last-first' : function () {
      Frames.update(this._id, {$set: {second: ' ', third: ' '}});
      var rvalue = ' ';
      var rpnt = 0;
      if(this.first === ' ') {rvalue = 'X';}
      if(this.first === 'X') {rvalue = '9';}
      if(this.first === '9') {rvalue = '8';}
      if(this.first === '8') {rvalue = '7';}
      if(this.first === '7') {rvalue = '6';}
      if(this.first === '6') {rvalue = '5';}
      if(this.first === '5') {rvalue = '4';}
      if(this.first === '4') {rvalue = '3';}
      if(this.first === '3') {rvalue = '2';}
      if(this.first === '2') {rvalue = '1';}
      if(this.first === '1') {rvalue = '-';}
      if(this.first === '-') {rvalue = ' ';}

      Frames.update(this._id, {$set: {first: rvalue}});
      updateFrame(this);
    }
  });   

   Template.tframe.events({
    'click .second' : function () {
      if(this.first === ' ' || this.first === 'X') return;
      var rvalue = 0;

      var mark = FrameMarkup.findOne({name: this.first});
      var nvalues = mark.score.split(',');

      for(var i=0; i<nvalues.length; i++) {
        if (nvalues[i] === this.second) 
        {
          if(i === nvalues.length-1) 
          {
            Frames.update(this._id, {$set: {second: nvalues[0]}});
            updateFrame(this);
            return;
          }
          if(i === 0) Frames.update(this._id, {$set: {second: nvalues[1]}});
          if(i === 1) Frames.update(this._id, {$set: {second: nvalues[2]}});
          if(i === 2) Frames.update(this._id, {$set: {second: nvalues[3]}});
          if(i === 3) Frames.update(this._id, {$set: {second: nvalues[4]}});
          if(i === 4) Frames.update(this._id, {$set: {second: nvalues[5]}});
          if(i === 5) Frames.update(this._id, {$set: {second: nvalues[6]}});
          if(i === 6) Frames.update(this._id, {$set: {second: nvalues[7]}});
          if(i === 7) Frames.update(this._id, {$set: {second: nvalues[8]}});
          if(i === 8) Frames.update(this._id, {$set: {second: nvalues[9]}});
          if(i === 9) Frames.update(this._id, {$set: {second: nvalues[10]}});
          if(i === 10) Frames.update(this._id, {$set: {second: nvalues[11]}});
          if(i === 11) Frames.update(this._id, {$set: {second: nvalues[12]}});
          if(i === 12) Frames.update(this._id, {$set: {second: nvalues[13]}});
          updateFrame(this);
          return;
        }
      }
    }  
  });

   Template.tframe.events({
    'click .last-second' : function () {
      Frames.update(this._id, {$set: {third: ' '}});
      if(this.first === ' ') return;
      if(this.first === 'X')
      {
      var rvalue = ' ';
      var rpnt = 0;
      if(this.second === ' ') {rvalue = 'X';}
      if(this.second === 'X') {rvalue = '9';}
      if(this.second === '9') {rvalue = '8';}
      if(this.second === '8') {rvalue = '7';}
      if(this.second === '7') {rvalue = '6';}
      if(this.second === '6') {rvalue = '5';}
      if(this.second === '5') {rvalue = '4';}
      if(this.second === '4') {rvalue = '3';}
      if(this.second === '3') {rvalue = '2';}
      if(this.second === '2') {rvalue = '1';}
      if(this.second === '1') {rvalue = '-';}
      if(this.second === '-') {rvalue = ' ';}
      Frames.update(this._id, {$set: {second: rvalue}});
      updateFrame(this);
      }
      else
      {
      var rvalue = 0;

      var mark = FrameMarkup.findOne({name: this.first});
      var nvalues = mark.score.split(',');

      for(var i=0; i<nvalues.length; i++) {
        if (nvalues[i] === this.second) 
        {
          if(i === nvalues.length-1) 
          {
            Frames.update(this._id, {$set: {second: nvalues[0]}});
            updateFrame(this);
            return;
          }
          if(i === 0) Frames.update(this._id, {$set: {second: nvalues[1]}});
          if(i === 1) Frames.update(this._id, {$set: {second: nvalues[2]}});
          if(i === 2) Frames.update(this._id, {$set: {second: nvalues[3]}});
          if(i === 3) Frames.update(this._id, {$set: {second: nvalues[4]}});
          if(i === 4) Frames.update(this._id, {$set: {second: nvalues[5]}});
          if(i === 5) Frames.update(this._id, {$set: {second: nvalues[6]}});
          if(i === 6) Frames.update(this._id, {$set: {second: nvalues[7]}});
          if(i === 7) Frames.update(this._id, {$set: {second: nvalues[8]}});
          if(i === 8) Frames.update(this._id, {$set: {second: nvalues[9]}});
          if(i === 9) Frames.update(this._id, {$set: {second: nvalues[10]}});
          if(i === 10) Frames.update(this._id, {$set: {second: nvalues[11]}});
          if(i === 11) Frames.update(this._id, {$set: {second: nvalues[12]}});
          if(i === 12) Frames.update(this._id, {$set: {second: nvalues[13]}});
          updateFrame(this);
          return;
        }
      }
    }
    }  
  });

  Template.tframe.events({
    'click .last-third' : function () {

      if(this.second === ' ' || this.second === '-') return;
      if(this.second === 'X' || this.second === '/')
      {
      var rvalue = ' ';
      var rpnt = 0;
      if(this.third === ' ') {rvalue = 'X';}
      if(this.third === 'X') {rvalue = '9';}
      if(this.third === '9') {rvalue = '8';}
      if(this.third === '8') {rvalue = '7';}
      if(this.third === '7') {rvalue = '6';}
      if(this.third === '6') {rvalue = '5';}
      if(this.third === '5') {rvalue = '4';}
      if(this.third === '4') {rvalue = '3';}
      if(this.third === '3') {rvalue = '2';}
      if(this.third === '2') {rvalue = '1';}
      if(this.third === '1') {rvalue = '-';}
      if(this.third === '-') {rvalue = ' ';}
      Frames.update(this._id, {$set: {third: rvalue}});
      updateFrame(this);
      }
      else
      {
      var rvalue = 0;

      var mark = FrameMarkup.findOne({name: this.second});
      var nvalues = mark.score.split(',');

      for(var i=0; i<nvalues.length; i++) {
        if (nvalues[i] === this.third) 
        {
          if(i === nvalues.length-1) 
          {
            Frames.update(this._id, {$set: {third: nvalues[0]}});
            updateFrame(this);
            return;
          }
          if(i === 0) Frames.update(this._id, {$set: {third: nvalues[1]}});
          if(i === 1) Frames.update(this._id, {$set: {third: nvalues[2]}});
          if(i === 2) Frames.update(this._id, {$set: {third: nvalues[3]}});
          if(i === 3) Frames.update(this._id, {$set: {third: nvalues[4]}});
          if(i === 4) Frames.update(this._id, {$set: {third: nvalues[5]}});
          if(i === 5) Frames.update(this._id, {$set: {third: nvalues[6]}});
          if(i === 6) Frames.update(this._id, {$set: {third: nvalues[7]}});
          if(i === 7) Frames.update(this._id, {$set: {third: nvalues[8]}});
          if(i === 8) Frames.update(this._id, {$set: {third: nvalues[9]}});
          if(i === 9) Frames.update(this._id, {$set: {third: nvalues[10]}});
          if(i === 10) Frames.update(this._id, {$set: {third: nvalues[11]}});
          if(i === 11) Frames.update(this._id, {$set: {third: nvalues[12]}});
          if(i === 12) Frames.update(this._id, {$set: {third: nvalues[13]}});
          updateFrame(this);
          return;
        }
      }
    }
    }  
  });

  Template.tgame.events({
    'click i.del' : function () {
      var frames = Frames.find({gameid: this._id}).forEach(function (frame) {
        Frames.remove(frame._id);  
      });
      Games.remove(this._id);
    }  
  });

  Template.controls.allfrmes = function () {
    return Frames.find().count();
  };

  //adds new game with 10 new frames
  Template.controls.events({
    'click input.add' : function () {
        var id = Games.insert({name: 'Tomi Tavela'});
        for (var i = 1; i < 11; i++)
          Frames.insert({gameid: id, framenro: i, points: 0, first: ' ', second: ' ', third: ' '});
      }  
  });

Template.controls.events({
  'click input.save': function (event, template) {
    var title = template.find(".title").value;

    if (title.length) {
      var id = Games.insert({name: title});
        for (var i = 1; i < 11; i++)
          Frames.insert({gameid: id, framenro: i, points: 0, first: ' ', second: ' ', third: ' '});
    }
  }
});

    //adds new game with 10 new frames
  Template.controls.events({
    'click input.openDlg' : function () {
      openCreateDialog();
    }
  });

  //edit player
  Template.tgame.events({
    'click i.editDlg' : function () {
      openEditDialog(this);
    }
  });

///////////////////////////////////////////////////////////////////////////////
// Create Add Player dialog

var openCreateDialog = function () {
  Session.set("createError", null);
  Session.set("showCreateDialog", true);
};

Template.page.showCreateDialog = function () {
  return Session.get("showCreateDialog");
};

Template.createDialog.events({
  'click .save': function (event, template) {
    var title = template.find(".title").value;

    if (title.length) {
      var id = Games.insert({name: title});
        for (var i = 1; i < 11; i++)
          Frames.insert({gameid: id, framenro: i, points: 0, first: ' ', second: ' ', third: ' '});
        Session.set("showCreateDialog", false);
    } else {
      Session.set("createError", "The player really needs a name...");
    }
  },

  'click .cancel': function () {
    Session.set("showCreateDialog", false);
  }
});

Template.createDialog.error = function () {
  return Session.get("createError");
};

///////////////////////////////////////////////////////////////////////////////
// Create Edit Player dialog

var openEditDialog = function (game) {
  Session.set("createError", null);
  Session.set("showEditDialog", true);
  Session.set("gameToEdit", game);
};

Template.page.showEditDialog = function () {
  return Session.get("showEditDialog");
};

Template.editDialog.playerName = function () {
  var game = Session.get("gameToEdit");
 return game.name;
};

Template.editDialog.events({
  'click .save': function (event, template) {
    var title = template.find(".title").value;
    var game = Session.get("gameToEdit");

    if (title.length) {
      Games.update(game._id, {$set: {name: title}});
        Session.set("showEditDialog", false);
    } else {
      Session.set("createError", "The player really needs a name...");
    }
  },

  'click .cancel': function () {
    Session.set("showEditDialog", false);
  }
});

Template.editDialog.error = function () {
  return Session.get("createError");
};
/////////////////

}

if (Meteor.isServer) {
  Meteor.startup(function () {
    if (FrameMarkup.find().count() === 0) {
      FrameMarkup.insert({name: '9', score: '/,-, '});
      FrameMarkup.insert({name: '8', score: '/,1,-, '});
      FrameMarkup.insert({name: '7', score: '/,2,1,-, '});
      FrameMarkup.insert({name: '6', score: '/,3,2,1,-, '});
      FrameMarkup.insert({name: '5', score: '/,4,3,2,1,-, '});
      FrameMarkup.insert({name: '4', score: '/,5,4,3,2,1,-, '});    
      FrameMarkup.insert({name: '3', score: '/,6,5,4,3,2,1,-, '});    
      FrameMarkup.insert({name: '2', score: '/,7,6,5,4,3,2,1,-, '});    
      FrameMarkup.insert({name: '1', score: '/,8,7,6,5,4,3,2,1,-, '});  
      FrameMarkup.insert({name: '-', score: '/,9,8,7,6,5,4,3,2,1,-, '});
    }  
  });
}