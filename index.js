const Discord = require("discord.js");
const YTDL = require("ytdl-core");

const token = "MzA0ODA0Njg1MTU4NTQ3NDU2.C-JuLw.CHKq2RSAS5EgSkoskUOpQ_jXdkI";
const prefix = "?";

function generateHex() {
    return '#' + Math.floor(Math.random() * 16777215).toString(16);
}

function play(connection, message) {
    var server = servers[message.guild.id];

    server.dispatcher = connection.playStream(YTDL(server.queue[0], {filter: "audioonly"}));

    server.queue.shift();

    server.dispatcher.on("end", function() {
        if (server.queue[0]) play(connection, message);
        else connection.disconnect();
    });
}

var fortunes = [
    "Yes",
    "No",
    "Maybe",
    "Ask again later",
    "When you're older",
    "The Drizzle only answers scheduled questions",
    "If you pay me $20",
    "That question is sooo beneath The Drizzle"
];

var bot  = new Discord.Client();

var servers = {};

bot.on("ready", function() {
    console.log("Ready!");
});

// FIX THIS FUCKING CODE
bot.on("guildMemberAdd", function(member) {
    member.guild.defaultChannel.sendMessage(member.toString() + " Welcome to " + member.guild.name + "! The Drizzle wishes he could be here to assist you, but unfortunately he's out right now on very important taco related business.");

    // member.addRole(member.guild.roles.find("name", "bitch"));

    // member.guild.createRole({
    //     name: member.user.username,
    //     color: generateHex(),
    //     permissions: []
    // }).then(function(role) {
    //     member.addRole(role);
    // })
});

bot.on("message", function(message) {
    if(message.author.equals(bot.user)) return;

    if(!message.content.startsWith(prefix)) return;

    var args = message.content.substring(prefix.length).split(" ");

    switch(args[0].toLowerCase()) {
        case "ping":
            message.channel.sendMessage("Pong!");
            break;
        
        case "info":
            message.channel.sendMessage("I am a bot based off of the classic ATHF superhero, 'The Drizzle'. Created by <@136313602993946624>");
            break;
        
        case "8ball":
            if (args[1]) {
                message.channel.sendMessage(fortunes[Math.floor(Math.random() * fortunes.length)]);
            } else {
                message.channel.sendMessage("You have to ask The Drizzle a question dumbass");;
            }
            break;

        case "embed":
            if (!args[1]) {
                message.channel.sendMessage("It's blank bro");
                return;
            }

            args.shift();
            args = args.toString();
            args = args.replace(/,/g, " ");
            var embed = new Discord.RichEmbed().addField(message.author.username + "'s Embed", args);
            message.channel.sendEmbed(embed);

            break;
        
        case "drizzle":
            message.channel.sendMessage("Well, well, well, LOOK at what has happened. LOOK who's locked out... IN THE DRIZZLE! WHERE'S YOUR PONCHO NOW!?!");
            break;

        // case "test":
        //     message.channel.sendMessage(message.guild.members.array());
        //     console.log(message.guild.members.array());
        //     break;

        // case "removerole":
        //     message.member.removeRole(message.guild.roles.find("name", "bitch"));
        //     break;
        
        // case "deleterole":
        //     message.guild.roles.find("name", "bitch");
        //     break;

        case "play":
            if (!args[1]) {
                message.channel.sendMessage("Wha? I dunno how to do this! The Drizzle only works with linked videos durr");
                return;
            }

            if (!message.member.voiceChannel) {
                message.channel.sendMessage("If you're not in a friggin voice channel then how are you supposed to hear my material?!");
                return;
            }

            if (!servers[message.guild.id]) servers[message.guild.id] = {
                queue: []
            }

            var server = servers[message.guild.id];

            server.queue.push(args[1]);

            if (!message.guild.voiceConnection) message.member.voiceChannel.join().then(function(connection) {
                play(connection, message);
            });
            break;
        
        case "skip":
            var server = servers[message.guild.id];

            if (server.dispatcher) server.dispatcher.end();
            break;
        
        case "stop":
            var server = servers[message.guild.id];

            if (message.guild.voiceConnection) message.guild.voiceConnection.disconnect();
            break;

        default:
            message.channel.sendMessage("Invalid command");
    }
});

bot.login(token);