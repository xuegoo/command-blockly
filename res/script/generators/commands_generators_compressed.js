// Do not edit this file; automatically generated by build.py.
'use strict';

goog.provide('Blockly.Commands');
goog.require('Blockly.Generator');

Blockly.Commands = new Blockly.Generator('Commands');

Blockly.Commands.INFINITE_LOOP_TRAP = null;
Blockly.Commands.STATEMENT_PREFIX = null;
Blockly.Commands.INDENT = '  ';
Blockly.Commands.RESERVED_WORDS_ = '';
Blockly.Commands.FUNCTION_NAME_PLACEHOLDER_ = '{leCUI8hutHZI4480Dc}';

Blockly.Commands.ORDER_ATOMIC = 99;            // 0 "" ...
Blockly.Commands.ORDER_COLLECTION = 1;        // tuples, lists, dictionaries
Blockly.Commands.ORDER_STRING_CONVERSION = 1; // `expression...`
Blockly.Commands.ORDER_MEMBER = 2;            // . []
Blockly.Commands.ORDER_FUNCTION_CALL = 2;     // ()
Blockly.Commands.ORDER_EXPONENTIATION = 3;    // **
Blockly.Commands.ORDER_UNARY_SIGN = 4;        // + -
Blockly.Commands.ORDER_BITWISE_NOT = 4;       // ~
Blockly.Commands.ORDER_MULTIPLICATIVE = 5;    // * / // %
Blockly.Commands.ORDER_ADDITIVE = 6;          // + -
Blockly.Commands.ORDER_BITWISE_SHIFT = 7;     // << >>
Blockly.Commands.ORDER_BITWISE_AND = 8;       // &
Blockly.Commands.ORDER_BITWISE_XOR = 9;       // ^
Blockly.Commands.ORDER_BITWISE_OR = 10;       // |
Blockly.Commands.ORDER_RELATIONAL = 11;       // in, not in, is, is not,
Blockly.Commands.ORDER_LOGICAL_NOT = 12;      // not
Blockly.Commands.ORDER_LOGICAL_AND = 13;      // and
Blockly.Commands.ORDER_LOGICAL_OR = 14;       // or
Blockly.Commands.ORDER_CONDITIONAL = 15;      // if else
Blockly.Commands.ORDER_LAMBDA = 16;           // lambda
Blockly.Commands.ORDER_NONE = 99;             // (...)

Blockly.Commands.workspaceToCode = function(workspace) {
  if (!workspace)
    workspace = Blockly.getMainWorkspace();
  var code = [];
  Blockly.Commands.init(workspace);
  var blocks = workspace.getTopBlocks(true);
  for (var x = 0, block; block = blocks[x]; x++) {
    var line = Blockly.Commands.blockToCode(block);
    if (goog.isArray(line)) line = line[0];
    if (line) code.push(line);
  }
  code = code.join('\n');
  code = Blockly.Commands.finish(code);
  // Final scrubbing of whitespace.
  code = code.replace(/^\s+\n/, '');
  code = code.replace(/\n\s+$/, '\n');
  code = code.replace(/[ \t]+\n/g, '\n');
  return code;
};
Blockly.Commands.init = function(workspace) {
  Blockly.Commands.definitions_ = Object.create(null);
  Blockly.Commands.functionNames_ = Object.create(null);
  if (!Blockly.Commands.variableDB_)
    Blockly.Commands.variableDB_ = new Blockly.Names(Blockly.Commands.RESERVED_WORDS_);
  else
    Blockly.Commands.variableDB_.reset();
  var defvars = [];
  var variables = Blockly.Variables.allVariables(workspace);
  for (var i = 0; i < variables.length; i++)
    defvars[i] = Blockly.Commands.variableDB_.getName(variables[i], Blockly.Variables.NAME_TYPE) + ' = None';
  Blockly.Commands.definitions_['variables'] = defvars.join('\n');
};
Blockly.Commands.valueToCode = function(block, name, order) {
  if (isNaN(order))
    goog.asserts.fail('Expecting valid order from block "%s".', block.type);
  var targetBlock = block.getInputTargetBlock(name);
  if (!targetBlock)
    return '';
  var tuple = this.blockToCode(targetBlock);
  if (tuple === '')
    return '';
  goog.asserts.assertArray(tuple, 'Expecting tuple from value block "%s".', targetBlock.type);
  var code = tuple[0];
  var innerOrder = tuple[1];
  if (isNaN(innerOrder))
    goog.asserts.fail('Expecting valid order from value block "%s".', targetBlock.type);
  if (code && order <= innerOrder) {
    if (order == innerOrder && (order == 0 || order == 99)) {}
    else
      code = '(' + code + ')';
  }
  return code;
};
Blockly.Commands.statementToCode = function(block, name) {
  var targetBlock = block.getInputTargetBlock(name);
  var code = this.blockToCode(targetBlock);
  goog.asserts.assertString(code, 'Expecting code from statement block "%s".',
      targetBlock && targetBlock.type);
  return code;
};
Blockly.Commands.blockToCode = function(block) {
  if (!block)
    return '';
  if (block.disabled)
    return Blockly.Commands.blockToCode(block.getNextBlock());
  var func = Blockly.Commands[block.type];
  goog.asserts.assertFunction(func, 'Language "%s" does not know how to generate code for block type "%s".', Blockly.Commands.name_, block.type);
  var code = func.call(block, block); // call to block dependent functions.
  if (goog.isArray(code)) {
    return [Blockly.Commands.scrub_(block, code[0]), code[1]];
  } else if (goog.isString(code)) {
    if (Blockly.Commands.STATEMENT_PREFIX)
      code = Blockly.Commands.STATEMENT_PREFIX.replace(/%1/g, '\'' + block.id + '\'') + code;
    return Blockly.Commands.scrub_(block, code);
  } else if (code === null) {
    return '';
  } else {
    goog.asserts.fail('Invalid code generated: %s', code);
  }
};
Blockly.Commands.nextblockToCode = function(block) {
  return Blockly.Commands.blockToCode(block.getNextBlock());
};
Blockly.Commands.scrub_ = function(block, code) {
  var commentCode = '';
  if (!block.outputConnection || !block.outputConnection.targetConnection) {
    var comment = block.getCommentText();
    if (comment)
      commentCode += Blockly.Commands.prefixLines(comment, '# ') + '\n';
    for (var x = 0; x < block.inputList.length; x++)
      if (block.inputList[x].type == Blockly.INPUT_VALUE) {
        var childBlock = block.inputList[x].connection.targetBlock();
        if (childBlock) {
          var comment = Blockly.Commands.allNestedComments(childBlock);
          if (comment)
            commentCode += Blockly.Commands.prefixLines(comment, '# ');
        }
      }
  }
  var nextBlock = block.nextConnection && block.nextConnection.targetBlock();
  //var nextCode = Blockly.Commands.blockToCode(nextBlock);
  return commentCode + code;// + nextCode;
};
Blockly.Commands.prefixLines = function(text, prefix) {
  return prefix + text.replace(/\n(.)/g, '\n' + prefix + '$1');
};
Blockly.Commands.allNestedComments = function(block) {
  var comments = [];
  var blocks = block.getDescendants();
  for (var x = 0; x < blocks.length; x++) {
    var comment = blocks[x].getCommentText();
    if (comment)
      comments.push(comment);
  }
  // Append an empty string to create a trailing line break when joined.
  if (comments.length)
    comments.push('');
  return comments.join('\n');
};
Blockly.Commands.provideFunction_ = function(desiredName, code) {
  if (!this.definitions_[desiredName]) {
    var functionName =
        this.variableDB_.getDistinctName(desiredName, this.NAME_TYPE);
    this.functionNames_[desiredName] = functionName;
    this.definitions_[desiredName] = code.join('\n').replace(
        this.FUNCTION_NAME_PLACEHOLDER_REGEXP_, functionName);
  }
  return this.functionNames_[desiredName];
};
Blockly.Commands.addReservedWords = function(words) {
  this.RESERVED_WORDS_ += words + ',';
};
Blockly.Commands.addLoopTrap = function(branch, id) {
  if (Blockly.Commands.INFINITE_LOOP_TRAP) {
    branch = Blockly.Commands.INFINITE_LOOP_TRAP.replace(/%1/g, '\'' + id + '\'') + branch;
  }
  if (this.STATEMENT_PREFIX) {
    branch += this.prefixLines(this.STATEMENT_PREFIX.replace(/%1/g,
        '\'' + id + '\''), this.INDENT);
  }
  return branch;
};
Blockly.Commands.quote_ = function(string) {
  // TODO: This is a quick hack.  Replace with goog.string.quote
  string = string.replace(/\\/g, '\\\\')
                 .replace(/\n/g, '\\\n')
                 .replace(/\%/g, '\\%')
                 .replace(/'/g, '\\\'');
  return '\'' + string + '\'';
};
Blockly.Commands.finish = function(code) {
  var imports = [];
  var definitions = [];
  for (var name in Blockly.Commands.definitions_) {
    var def = Blockly.Commands.definitions_[name];
    if (def.match(/^(from\s+\S+\s+)?import\s+\S+/))
      imports.push(def);
    else
      definitions.push(def);
  }
  delete Blockly.Commands.definitions_;
  delete Blockly.Commands.functionNames_;
  Blockly.Commands.variableDB_.reset();
  var allDefs = imports.join('\n') + '\n\n' + definitions.join('\n\n');
  return allDefs.replace(/\n\n+/g, '\n\n').replace(/\n*$/, '\n\n\n') + code;
};

//Structure to accept commands
Blockly.Commands['simple_command'] = function(block) {
  var value_command = Blockly.Commands.valueToCode(block, 'COMMAND', Blockly.Commands.ORDER_NONE);
  var next = Blockly.Commands.nextblockToCode(block);
  var code = "";
  if(value_command != "") code = '/'+value_command+"\n"+next; 
  return code;
};

//Common Structures
Blockly.Commands['stat_text_input'] = function(block) {
  var text_stat = block.getFieldValue('STAT');
  // TODO: Assemble Python into code variable.
  var code = text_stat;
  // TODO: Change ORDER_NONE to the correct strength.
  return [code, Blockly.Commands.ORDER_NONE];
};
Blockly.Commands['coords'] = function(block) {
  var text_x = block.getFieldValue('X');
  var text_y = block.getFieldValue('Y');
  var text_z = block.getFieldValue('Z');
  // TODO: Assemble JavaScript into code variable.
  var code = text_x+' '+text_y+' '+text_z;
  // TODO: Change ORDER_NONE to the correct strength.
  return [code, Blockly.Commands.ORDER_NONE];
};
Blockly.Commands['player_selector'] = function(block) {
  var dropdown_name = block.getFieldValue('NAME');
  var value_name = Blockly.Commands.valueToCode(block, 'NAME', Blockly.Commands.ORDER_NONE);
  var code = '@'+dropdown_name
  if(value_name != "") code = code + "[" + value_name + "]";
  return [code, Blockly.Commands.ORDER_NONE];
};
Blockly.Commands['ps_mode'] = function(block) {
  var dropdown_name = block.getFieldValue('NAME');
  var value_name = Blockly.Commands.valueToCode(block, 'NAME', Blockly.Commands.ORDER_NONE);
  var code = 'm=' + dropdown_name;
  if(value_name != "") code = code + ',' + value_name;
  return [code, Blockly.Commands.ORDER_NONE];
};

//nbt
Blockly.Commands['nbt_compound'] = function(block) {
  var statements_childs = Blockly.Commands.statementToCode(block, 'CHILDS');
  var code = '{'+statements_childs+'}';
  return code;
};
Blockly.Commands['nbt_compound_null'] = function(block) {
  return "";
};
Blockly.Commands['nbt_compound_byte'] = function(block) {
  var text_name = block.getFieldValue('NAME');
  var text_value = block.getFieldValue('VALUE');
  var next = Blockly.Commands.nextblockToCode(block);
  if (next != "") next=","+next;
  var code = '"'+text_name+'":'+text_value+'b'+next;
  return code;
};
Blockly.Commands['nbt_compound_short'] = function(block) {
  var text_name = block.getFieldValue('NAME');
  var text_value = block.getFieldValue('VALUE');
  var next = Blockly.Commands.nextblockToCode(block);
  if (next != "") next=","+next;
  var code = '"'+text_name+'":'+text_value+'s'+next;
  return code;
};
Blockly.Commands['nbt_compound_int'] = function(block) {
  var text_name = block.getFieldValue('NAME');
  var text_value = block.getFieldValue('VALUE');
  var next = Blockly.Commands.nextblockToCode(block);
  if (next != "") next=","+next;
  var code = '"'+text_name+'":'+text_value+'i'+next;
  return code;
};
Blockly.Commands['nbt_compound_long'] = function(block) {
  var text_name = block.getFieldValue('NAME');
  var text_value = block.getFieldValue('VALUE');
  var next = Blockly.Commands.nextblockToCode(block);
  if (next != "") next=","+next;
  var code = '"'+text_name+'":'+text_value+'l'+next;
  return code;
};
Blockly.Commands['nbt_compound_float'] = function(block) {
  var text_name = block.getFieldValue('NAME');
  var text_value = block.getFieldValue('VALUE');
  var next = Blockly.Commands.nextblockToCode(block);
  if (next != "") next=","+next;
  var code = '"'+text_name+'":'+text_value+'f'+next;
  return code;
};
Blockly.Commands['nbt_compound_double'] = function(block) {
  var text_name = block.getFieldValue('NAME');
  var text_value = block.getFieldValue('VALUE');
  var next = Blockly.Commands.nextblockToCode(block);
  if (next != "") next=","+next;
  var code = '"'+text_name+'":'+text_value+'d'+next;
  return code;
};
Blockly.Commands['nbt_compound_string'] = function(block) {
  var text_name = block.getFieldValue('NAME');
  var text_value = block.getFieldValue('VALUE');
  var next = Blockly.Commands.nextblockToCode(block);
  if (next != "") next=","+next;
  var code = '"'+text_name+'":"'+text_value+'"'+next;
  return code;
};
Blockly.Commands['nbt_compound_compound'] = function(block) {
  var text_name = block.getFieldValue('NAME');
  var statements_childs = Blockly.Commands.statementToCode(block, 'CHILDS');
  var next = Blockly.Commands.nextblockToCode(block);
  if (next != "") next = ","+next;
  var code = '"'+text_name+'":{'+statements_childs+'}'+next;
  return code;
};
Blockly.Commands['nbt_compound_list'] = function(block) {
  var text_name = block.getFieldValue('NAME');
  var statements_childs = Blockly.Commands.statementToCode(block, 'CHILDS');
  var next = Blockly.Commands.nextblockToCode(block);
  if (next != "") next = ","+next;
  var code = '"'+text_name+'":['+statements_childs+']'+next;
  return code;
};
Blockly.Commands['nbt_list_null'] = function(block) {
  return "";
};
Blockly.Commands['nbt_list_byte'] = function(block) {
  var text_value = block.getFieldValue('VALUE');
  var next = Blockly.Commands.nextblockToCode(block);
  if (next != "") next=","+next;
  var code = text_value+'b'+next;
  return code;
};
Blockly.Commands['nbt_list_short'] = function(block) {
  var text_value = block.getFieldValue('VALUE');
  var next = Blockly.Commands.nextblockToCode(block);
  if (next != "") next=","+next;
  var code = text_value+'s'+next;
  return code;
};
Blockly.Commands['nbt_list_int'] = function(block) {
  var text_value = block.getFieldValue('VALUE');
  var next = Blockly.Commands.nextblockToCode(block);
  if (next != "") next=","+next;
  var code = text_value+'i'+next;
  return code;
};
Blockly.Commands['nbt_list_long'] = function(block) {
  var text_value = block.getFieldValue('VALUE');
  var next = Blockly.Commands.nextblockToCode(block);
  if (next != "") next=","+next;
  var code = text_value+'l'+next;
  return code;
};
Blockly.Commands['nbt_list_float'] = function(block) {
  var text_value = block.getFieldValue('VALUE');
  var next = Blockly.Commands.nextblockToCode(block);
  if (next != "") next=","+next;
  var code = text_value+'f'+next;
  return code;
};
Blockly.Commands['nbt_list_double'] = function(block) {
  var text_value = block.getFieldValue('VALUE');
  var next = Blockly.Commands.nextblockToCode(block);
  if (next != "") next=","+next;
  var code = text_value+'d'+next;
  return code;
};
Blockly.Commands['nbt_list_string'] = function(block) {
  var text_value = block.getFieldValue('VALUE');
  var next = Blockly.Commands.nextblockToCode(block);
  if (next != "") next=","+next;
  var code = '"'+text_value+'"'+next;
  return code;
};
Blockly.Commands['nbt_list_compound'] = function(block) {
  var statements_childs = Blockly.Commands.statementToCode(block, 'CHILDS');
  var next = Blockly.Commands.nextblockToCode(block);
  if (next != "") next = ","+next;
  var code = '{'+statements_childs+'}'+next;
  return code;
};
Blockly.Commands['nbt_list_list'] = function(block) {
  var statements_childs = Blockly.Commands.statementToCode(block, 'CHILDS');
  var next = Blockly.Commands.nextblockToCode(block);
  if (next != "") next = ","+next;
  var code = '['+statements_childs+']'+next;
  return code;
};

//commands
Blockly.Commands['command_achievement'] = function(block) {
  var dropdown_action = block.getFieldValue('ACTION');
  var value_stat = Blockly.Commands.valueToCode(block, 'STAT', Blockly.Commands.ORDER_NONE);
  var value_players = Blockly.Commands.valueToCode(block, 'PLAYERS', Blockly.Commands.ORDER_NONE);
  if(value_stat == "") value_stat = "*";
  if(value_players != "") value_players = ' '+value_players;
  var code = 'achievement '+dropdown_action+' '+value_stat+value_players;
  return [code, Blockly.Commands.ORDER_NONE];
};
Blockly.Commands['command_blockdata'] = function(block) {
  var value_coords = Blockly.Commands.valueToCode(block, 'COORDS', Blockly.Commands.ORDER_NONE);
  var value_nbt = Blockly.Commands.statementToCode(block, 'NBT', Blockly.Commands.ORDER_NONE);
  if(value_coords == "") value_coords = "<x> <y> <z>";
  if(value_nbt == "") value_nbt = '<datatag>';
  var code = 'blockdata '+value_coords+' '+value_nbt;
  return [code, Blockly.Commands.ORDER_NONE];
};
Blockly.Commands['command_clear'] = function(block) {
  var value_player = Blockly.Commands.valueToCode(block, 'PLAYER', Blockly.Commands.ORDER_NONE);
  var value_item = Blockly.Commands.valueToCode(block, 'ITEM', Blockly.Commands.ORDER_NONE);
  var value_data = Blockly.Commands.valueToCode(block, 'DATA', Blockly.Commands.ORDER_NONE);
  var value_maxcount = Blockly.Commands.valueToCode(block, 'MAXCOUNT', Blockly.Commands.ORDER_NONE);
  var value_nbt = Blockly.Commands.statementToCode(block, 'NBT', Blockly.Commands.ORDER_NONE);
  var code = "";
  if(value_nbt != "") code = " "+value_nbt;
  if(value_maxcount == "" && code != "") value_maxcount = "[maxCount]";
  if(value_maxcount != "") code = " "+value_maxcount+code;
  if(value_data == "" && code != "") value_data = "[data]";
  if(value_data != "") code = " "+value_data+code;
  if(value_item == "" && code != "") value_item = "[item]";
  if(value_item != "") code = " "+value_item+code;
  if(value_player == "" && code != "") value_player = "[player]";
  if(value_player != "") code = " "+value_player+code;
  code = "clear" + code;
  return [code, Blockly.Commands.ORDER_NONE];
};
