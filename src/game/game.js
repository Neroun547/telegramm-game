const cacheQuestion = {}; 

async function game(bot, ctx, room, payday, randomEvents, businessEvents, realEstateEvents, botService, rooms) {
    await ctx.reply("Починаємо");
    await ctx.reply("Перевіряйте повідомлення від боту");
    this.count = payday;
    const setAnswer = new Set();
    // Variable for check all user answer the events ?
    this.usersAnswer = 0;

    room.users.forEach((el) => {
        const randomCount = Math.floor(Math.random() * 3);

        if(randomCount === 0) {
            const randomNum = Math.floor(Math.random() * 2);

            if(randomNum) {
                const event = randomEvents.getRandomPositiveEvent();
                el.money += event.cost;
                ctx.telegram.sendMessage(el.user, event.description);
                this.usersAnswer+=1;
    
                return;
            }
            if(!randomNum) {
                const event = randomEvents.getRandomNegativeEvent();
                el.money -= event.cost;
                ctx.telegram.sendMessage(el.user, event.description);
                this.usersAnswer+=1;
    
                return;
            } 
        } else if(randomCount === 1 && businessEvents.business.length) {
            const business = businessEvents.getRandomBusiness();
            ctx.telegram.sendMessage(el.user, `Ви хочете купити ${business.business.name} за ${business.business.cost} ? Введіть /yes якщо так або /no якщо ні (відповідь обов'язкова)`);
            
            businessEvents.buy(business.businessIndex);
            cacheQuestion[el.user] = business.business;
        }  else if(randomCount === 2 && realEstateEvents.realEstate.length) {
            const realEstate = realEstateEvents.getRandomRealEstate();
            ctx.telegram.sendMessage(el.user, `Ви хочете купити ${realEstate.realEstate.name} за ${realEstate.realEstate.cost} ? Введіть /yes якщо так або /no якщо ні (відповідь обов'язкова)`);
        
            realEstateEvents.buy(realEstate.indexRealEstate);
            cacheQuestion[el.user] = realEstate.realEstate;
        } else {
            const randomNum = Math.floor(Math.random() * 2);

            if(randomNum) {
                const event = randomEvents.getRandomPositiveEvent();
                el.money += event.cost;
                ctx.telegram.sendMessage(el.user, event.description);
                this.usersAnswer+=1;
    
                return;
            }
            if(!randomNum) {
                const event = randomEvents.getRandomNegativeEvent();
                el.money -= event.cost;
                ctx.telegram.sendMessage(el.user, event.description);
                this.usersAnswer+=1;
    
                return;
            } 
        }
    });

    bot.command("/yes", async (ctx) => {

        if(ctx.message.chat.type === "private") {
            const idUser = ctx.message.from.id;
            const target = cacheQuestion[idUser];
            const userIndex = room.users.findIndex(el => el.user === idUser);
            
            if(target !== undefined) {
                if(target.type === "business") {

                    const buy = room.users[userIndex].buyBusiness(target);

                    if(buy) {
                        await ctx.reply("Ви купили новий бізнес !");
                    }
                    if(!buy) {
                        businessEvents.returnBusiness(target);
                        await ctx.reply("У вас недостатньо коштів");
                        
                        return;
                    }
            
                }
                if(target.type === "realEstate") {
                    const buy = room.users[userIndex].buyRealEstate(target);

                    if(buy) {
                        await ctx.reply("Ви купили нову нерухомість !");
                    }
                    if(!buy) {
                        realEstateEvents.returnRealEstate(target);
                        await ctx.reply("У вас недостатньо коштів");
                        
                        return;
                    }
                }

                delete cacheQuestion[idUser];

                this.usersAnswer+=1;
                
                if(this.usersAnswer === room.users.length) {

                    if(this.count >= 15) {
                        botService.deleteRoomById(rooms, room.idRoom);
                        setAnswer.clear();

                        let str = "";
        
                        const sortedArrUsers = room.users.sort((a, b) => b.allValue.allValue - a.allValue.allValue); 
                        sortedArrUsers.forEach((el, i) => {
                            str += `${i+1} Місце. ${el.allValue.username}. Сумарний капітал: ${el.allValue.allValue}\n `;
                        });      
                    
                        await ctx.telegram.sendMessage(room.idRoom, "Гру завершено");
                        await ctx.telegram.sendMessage(room.idRoom, "Місця гравців за сумарним капіталом (гроші + нерухомість + бізнес)");
                        await ctx.telegram.sendMessage(room.idRoom, str);
                        
                        return;
                    }
                    await ctx.telegram.sendMessage(room.idRoom, "Пиши команду /next, якщо ти готовий до наступного раунду та отримання прибутку з бізнесу");
                }
            }
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

            room.splice(userIndex, 1);
        }
    });

    bot.command("/no", async (ctx) => {

        if(ctx.message.chat.type === "private") {
            const idUser = ctx.message.from.id;
            const target = cacheQuestion[idUser];

            if(target !== undefined) {
                
                if(target.type === "business") {
                    businessEvents.returnBusiness(target);
                }
                if(target.type === "realEstate") {
                    realEstateEvents.returnRealEstate(target);
                }
                this.usersAnswer+=1;
                delete cacheQuestion[idUser];
                await ctx.reply("Ви відмовились від покупки");

                if(this.usersAnswer === room.users.length) {

                    if(this.count >= 15) {
                        botService.deleteRoomById(rooms, room.idRoom);
                        setAnswer.clear();

                        let str = "";
        
                        const sortedArrUsers = room.users.sort((a, b) => b.allValue.allValue - a.allValue.allValue); 
                        sortedArrUsers.forEach((el, i) => {
                            str += `${i+1} Місце. ${el.allValue.username}. Сумарний капітал: ${el.allValue.allValue}\n `;
                        });      
                    
                        await ctx.telegram.sendMessage(room.idRoom, "Гру завершено");
                        await ctx.telegram.sendMessage(room.idRoom, "Місця гравців за сумарним капіталом (гроші + нерухомість + бізнес)");
                        await ctx.telegram.sendMessage(room.idRoom, str);
                        
                        return;
                    }
                    await ctx.telegram.sendMessage(room.idRoom, "Пиши команду /next, якщо ти готовий до наступного раунду та отримання прибутку з бізнесу");
                }
            }
        }
    });

    bot.command("/balance", (ctx) => {
        if(ctx.message.chat.type === "private") {
            const user = room.users.find((el) => el.user === ctx.message.from.id);

            if(user) {
                ctx.reply(`Ваші кошти: ${user.money}`);

                return;
            }

            ctx.reply("Данних не знайдено, можливо ви не в грі зараз");
        }
    });
    
    bot.command("/business", (ctx) => {
        if(ctx.message.chat.type === "private") {
            const user = room.users.find((el) => el.user === ctx.message.from.id);

            if(user) {
                const calculateBusiness = user.getBusiness();

                if(calculateBusiness.cost) {
                    ctx.reply(`${calculateBusiness.str}. Сумарна ціна: ${calculateBusiness.cost}`);
                    return;
                }
                ctx.reply("Ви не маєте бізнесу");

                return;
            }
            ctx.reply(`Данних не знайдено, можливо ви зараз не в грі`);
        }
    });

    bot.command("/realEstate", (ctx) => {
        if(ctx.message.chat.type === "private") {
            const user = room.users.find((el) => el.user === ctx.message.from.id);

            if(user) {
                const calculateRealEstate = user.getRealEstate();
                
                if(calculateRealEstate.cost) {
                    ctx.reply(`${calculateRealEstate.str}. Сумарна ціна: ${calculateRealEstate.cost}`);
                    return;
                }
                ctx.reply("Ви не маєте нерухомості");

                return;
            }
            ctx.reply(`Данних не знайдено, можливо ви зараз не в грі`);
        } 
    });

    if(this.usersAnswer === room.users.length) {

        if(this.count >= 15) {
            botService.deleteRoomById(rooms, room.idRoom);
            setAnswer.clear();

            let str = "";
            const sortedArrUsers = room.users.sort((a, b) => b.allValue.allValue - a.allValue.allValue); 
            
            sortedArrUsers.forEach((el, i) => {
                str += `${i+1} Місце. ${el.allValue.username}. Сумарний капітал: ${el.allValue.allValue}\n `;
            });      
                    
            await ctx.telegram.sendMessage(room.idRoom, "Гру завершено");
            await ctx.telegram.sendMessage(room.idRoom, "Місця гравців за сумарним капіталом (гроші + нерухомість + бізнес)");
            await ctx.telegram.sendMessage(room.idRoom, str);
            
            return;
        }
        await ctx.reply("Пиши команду /next, якщо ти готовий до наступного раунду та отримання прибутку з бізнесу");
    }
    bot.command("/next", async (ctx) => {

        if(this.count < 15 && this.usersAnswer === room.users.length) {
            if(ctx.message.chat.type === "group") {
                const user = ctx.message.from;
            
                if(setAnswer.has(user.id)) {
                    ctx.reply(`${user.first_name}, ти вже проголосував :)`);

                    return;
                }
                setAnswer.add(ctx.message.from.id);
                await ctx.reply(`${user.first_name}, проголосував за продовження гри. Всьго голосів: ${setAnswer.size}/${room.users.length}`);
            
                if(setAnswer.size === room.users.length) {
                    setAnswer.clear();
                    room.users.forEach(async (el) => {
                        const pay = el.getPay();

                        await ctx.telegram.sendMessage(el.user, `Ви отримали прибуток у розмірі ${pay}. Всього коштів ${el.money}`);
                    });
                    game(bot, ctx, room, this.count+=1, randomEvents, businessEvents, realEstateEvents, botService, rooms);
                }   
            }

            return;
        }
    });
}

module.exports = { game };
