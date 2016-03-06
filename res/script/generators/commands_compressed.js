// Do not edit this file; automatically generated by build.py.
'use strict';

goog.provide('Blockly.Commands');

goog.require('Blockly.Generator');

Blockly.Commands = new Blockly.Generator('Commands');

/**
 * List of illegal variable names.
 * This is not intended to be a security feature.  Blockly is 100% client-side,
 * so bypassing this list is trivial.  This is intended to prevent users from
 * accidentally clobbering a built-in object or function.
 * @private
 */
Blockly.Commands.addReservedWords(
    // import keyword
    // print ','.join(keyword.kwlist)
    // http://docs.python.org/reference/lexical_analysis.html#keywords
    'and,as,assert,break,class,continue,def,del,elif,else,except,exec,finally,for,from,global,if,import,in,is,lambda,not,or,pass,print,raise,return,try,while,with,yield,' +
    //http://docs.python.org/library/constants.html
    'True,False,None,NotImplemented,Ellipsis,__debug__,quit,exit,copyright,license,credits,' +
    // http://docs.python.org/library/functions.html
    'abs,divmod,input,open,staticmethod,all,enumerate,int,ord,str,any,eval,isinstance,pow,sum,basestring,execfile,issubclass,print,super,bin,file,iter,property,tuple,bool,filter,len,range,type,bytearray,float,list,raw_input,unichr,callable,format,locals,reduce,unicode,chr,frozenset,long,reload,vars,classmethod,getattr,map,repr,xrange,cmp,globals,max,reversed,zip,compile,hasattr,memoryview,round,__import__,complex,hash,min,set,apply,delattr,help,next,setattr,buffer,dict,hex,object,slice,coerce,dir,id,oct,sorted,intern');

/**
 * Order of operation ENUMs.
 * http://docs.python.org/reference/expressions.html#summary
 */
Blockly.Commands.ORDER_ATOMIC = 0;            // 0 "" ...
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
                                            //     <, <=, >, >=, <>, !=, ==
Blockly.Commands.ORDER_LOGICAL_NOT = 12;      // not
Blockly.Commands.ORDER_LOGICAL_AND = 13;      // and
Blockly.Commands.ORDER_LOGICAL_OR = 14;       // or
Blockly.Commands.ORDER_CONDITIONAL = 15;      // if else
Blockly.Commands.ORDER_LAMBDA = 16;           // lambda
Blockly.Commands.ORDER_NONE = 99;             // (...)

/**
 * Empty loops or conditionals are not allowed in Commands.
 */
Blockly.Commands.PASS = '  pass\n';

/**
 * Initialise the database of variable names.
 * @param {!Blockly.Workspace} workspace Workspace to generate code from.
 */
Blockly.Commands.init = function(workspace) {
  // Create a dictionary of definitions to be printed before the code.
  Blockly.Commands.definitions_ = Object.create(null);
  // Create a dictionary mapping desired function names in definitions_
  // to actual function names (to avoid collisions with user functions).
  Blockly.Commands.functionNames_ = Object.create(null);

  if (!Blockly.Commands.variableDB_) {
    Blockly.Commands.variableDB_ =
        new Blockly.Names(Blockly.Commands.RESERVED_WORDS_);
  } else {
    Blockly.Commands.variableDB_.reset();
  }

  var defvars = [];
  var variables = Blockly.Variables.allVariables(workspace);
  for (var i = 0; i < variables.length; i++) {
    defvars[i] = Blockly.Commands.variableDB_.getName(variables[i],
        Blockly.Variables.NAME_TYPE) + ' = None';
  }
  Blockly.Commands.definitions_['variables'] = defvars.join('\n');
};

/**
 * Prepend the generated code with the variable definitions.
 * @param {string} code Generated code.
 * @return {string} Completed code.
 */
Blockly.Commands.finish = function(code) {
  // Convert the definitions dictionary into a list.
  var imports = [];
  var definitions = [];
  for (var name in Blockly.Commands.definitions_) {
    var def = Blockly.Commands.definitions_[name];
    if (def.match(/^(from\s+\S+\s+)?import\s+\S+/)) {
      imports.push(def);
    } else {
      definitions.push(def);
    }
  }
  // Clean up temporary data.
  delete Blockly.Commands.definitions_;
  delete Blockly.Commands.functionNames_;
  Blockly.Commands.variableDB_.reset();
  var allDefs = imports.join('\n') + '\n\n' + definitions.join('\n\n');
  return allDefs.replace(/\n\n+/g, '\n\n').replace(/\n*$/, '\n\n\n') + code;
};

/**
 * Naked values are top-level blocks with outputs that aren't plugged into
 * anything.
 * @param {string} line Line of generated code.
 * @return {string} Legal line of code.
 */
Blockly.Commands.scrubNakedValue = function(line) {
  return line + '\n';
};

/**
 * Encode a string as a properly escaped Commands string, complete with quotes.
 * @param {string} string Text to encode.
 * @return {string} Commands string.
 * @private
 */
Blockly.Commands.quote_ = function(string) {
  // TODO: This is a quick hack.  Replace with goog.string.quote
  string = string.replace(/\\/g, '\\\\')
                 .replace(/\n/g, '\\\n')
                 .replace(/\%/g, '\\%')
                 .replace(/'/g, '\\\'');
  return '\'' + string + '\'';
};

/**
 * Common tasks for generating Commands from blocks.
 * Handles comments for the specified block and any connected value blocks.
 * Calls any statements following this block.
 * @param {!Blockly.Block} block The current block.
 * @param {string} code The Commands code created for this block.
 * @return {string} Commands code with comments and subsequent blocks added.
 * @private
 */
Blockly.Commands.scrub_ = function(block, code) {
  var commentCode = '';
  // Only collect comments for blocks that aren't inline.
  if (!block.outputConnection || !block.outputConnection.targetConnection) {
    // Collect comment for this block.
    var comment = block.getCommentText();
    if (comment) {
      commentCode += Blockly.Commands.prefixLines(comment, '# ') + '\n';
    }
    // Collect comments for all value arguments.
    // Don't collect comments for nested statements.
    for (var x = 0; x < block.inputList.length; x++) {
      if (block.inputList[x].type == Blockly.INPUT_VALUE) {
        var childBlock = block.inputList[x].connection.targetBlock();
        if (childBlock) {
          var comment = Blockly.Commands.allNestedComments(childBlock);
          if (comment) {
            commentCode += Blockly.Commands.prefixLines(comment, '# ');
          }
        }
      }
    }
  }
  var nextBlock = block.nextConnection && block.nextConnection.targetBlock();
  var nextCode = Blockly.Commands.blockToCode(nextBlock);
  return commentCode + code + nextCode;
};

//Structure to accept commands
Blockly.Commands['simple_command'] = function(block) {
  var value_command = Blockly.Commands.valueToCode(block, 'COMMAND', Blockly.Commands.ORDER_NONE);
  var code = "";
  if(value_command != "") code = '/'+value_command+"\n"; 
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
