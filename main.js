const { Telegraf } = require("telegraf");
const telegramBotKey = "TOKEN";
const bot = new Telegraf(telegramBotKey);
const { User } = require("./src/User/User");
const { BotService } = require("./common/bot/bot.service");  
const { BusinessEvents } = require("./common/businessEvents/service/businessEvents.service");
const { RandomEvents } = require("./common/randomEvents/service/randomEvents.service");
const { RealEstateEvents } = require("./common/realEstateEvents/service/realEstate.service");  
const { game } = require("./src/game/game");

const botService = new BotService();
const timeoutsCache = {};
const rooms = [];

bot.catch((e) => {
    console.log(e);
    console.log("Some error");
});

bot.start((ctx) => {
    ctx.reply(`Привіт ) Це телеграмм бот для гри в гру "капітал". Для отримання інформації про бота введіть комманду /info`);
});

bot.command("info", (ctx) => {
    botService.getInfo(ctx);
});

bot.command("game", async (ctx) => {

    if(ctx.message.chat.type === "group") {
        const chatId = ctx.message.chat.id;
        const existRoom = rooms.findIndex(el => el.idRoom === chatId);

        if(existRoom === -1) { 
            const room = {
                idRoom: chatId,
                users: [],
                payday: 0
            }
            rooms.push(room);
            await ctx.reply("Кімната для гри створена. Для приєднання до гри введіть команду /joingame. Через 30 секунд почнеться гра !");

            timeoutsCache[chatId] = setTimeout(() => {
                if(room.users.length > 1) {
                    game(bot, ctx, room, 0, new RandomEvents(), new BusinessEvents(), new RealEstateEvents(), new BotService(), rooms); 
                    return;
                } 
                botService.deleteRoomByIdRoom(rooms, room.idRoom);
                ctx.reply("Недостатньо гравців для початку гри");         
            }, 30000);

            return;
        }
        await ctx.reply("Гра у вашому чаті вже створена. Для початку завершіть її, для цього введіть команду /endgame");
        return;
    }
    await ctx.reply("Додай мене в групу зі своїми друзями, а потім почни гру -_-");
});

bot.command("/joingame", async (ctx) => {
    
    if(ctx.message.chat.type === "group") {
        const userId = ctx.message.from.id;
        const chatId = ctx.message.chat.id;
        const existGameRoomIndex = rooms.findIndex((el) => el.idRoom === chatId);

        if(existGameRoomIndex !== -1 && rooms[existGameRoomIndex].users.length < 8) {
            const existUser = rooms[existGameRoomIndex].users.findIndex((el) => el.user === userId);
            const existUserInAnotherGameIndex = botService.existUserInAnotherGameIndex(rooms, userId);

            if(existUser === -1 && existUserInAnotherGameIndex === -1) {
                try {
                    const user = new User(ctx.message.from.first_name, userId);
                    await ctx.telegram.sendMessage(userId, `Ти приєднався до гри. На данний момент у тебе грошей: 10000, Репутація: 0`);
                    rooms[existGameRoomIndex].users.push(user);
                    await ctx.reply(`Користувач ${user.username} приєднався до гри. Кількість гравців - ${rooms[existGameRoomIndex].users.length}`);
                } catch(e) {
                    await ctx.reply(`Додайте цього бота собі ті хто цього не зробив !`);
                };

                return;
            }
            if(existUser !== -1) {
                try {
                    await ctx.telegram.sendMessage(userId, "Ти вже приєднався до гри :)");
                } catch(e) {
                    await ctx.reply(`Додайте цього бота собі ті хто цього не зробив !`);
                };
                return;
            }
            if(existUserInAnotherGameIndex !== -1) {
                try {
                    await ctx.telegram.sendMessage(userId, "Ти вже знаходишся у грі. Для того щоб приєднатися до нової заверш стару /leavegame");
                } catch(e) {
                    await ctx.reply(`Додайте цього бота собі ті хто цього не зробив !`);
                };
                return;
            }
        } 
        await ctx.reply(`Кімната для гри не створена. Для її створення введіть команду /game`);

        return;
    }
    await ctx.reply("Додай мене в групу зі своїми друзями, а потім почни гру -_-");
});

bot.command("/endgame", async (ctx) => {
    
    if(ctx.message.chat.type === "group") {
        const chatId = ctx.message.chat.id;
        clearTimeout(timeoutsCache[chatId]);
        delete timeoutsCache[chatId];

        const room = botService.deleteRoomByIdRoom(rooms, chatId);

        if(room.users.length) {
            let str = "";
        
            const sortedArrUsers = room.users.sort((a, b) => b.allValue.allValue - a.allValue.allValue); 
            sortedArrUsers.forEach((el, i) => {
                str += `${i+1} Місце. ${el.allValue.username}. Сумарний капітал: ${el.allValue.allValue}\n `;
            });      
        
            await ctx.reply("Гру завершено");
            await ctx.reply("Місця гравців за сумарним капіталом (гроші + нерухомість + бізнес)");
            await ctx.reply(str);

            return;
        }
        ctx.reply("Гру завершено");
    }
});

bot.command("/leavegame", async (ctx) => {
    
    if(ctx.message.chat.type === "private") {
        const username = ctx.message.from.first_name;
        const roomIdIndex = botService.existUserInAnotherGameIndex(rooms, ctx.message.from.id);

        if(roomIdIndex === -1) {
            ctx.reply("Данні не знайдено, можливо ви зараз не в грі");
            
            return;
        }
        const roomId = rooms[roomIdIndex].idRoom;

        await ctx.reply("Ви покинули гру");
        await ctx.telegram.sendMessage(roomId, `${username} покинув гру`);

        if((rooms[roomIdIndex].users.length - 1) <= 1) {
            const room = botService.deleteRoomByIdRoom(rooms, roomId);
            let str = "";
            
            const sortedArrUsers = room.users.sort((a, b) => b.allValue.allValue - a.allValue.allValue); 
            sortedArrUsers.forEach((el, i) => {
                str += `${i+1} Місце. ${el.allValue.username}. Сумарний капітал: ${el.allValue.allValue}\n `;
            });      
            
            await ctx.telegram.sendMessage(roomId, "Гру завершено");
            await ctx.telegram.sendMessage(roomId, "Місця гравців за сумарним капіталом (гроші + нерухомість + бізнес)");
            await ctx.telegram.sendMessage(roomId, str);

            return;
        }

        const userIndex = rooms[roomIdIndex].users.findIndex(el => el.user === ctx.message.from.id);
        rooms[roomIdIndex].users.splice(userIndex, 1);
    }
});

bot.launch();
