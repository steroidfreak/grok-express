const promptsData = ("../data/promptsData");

async function getAllPrompts() {

    return await promptsData.getAllPrompts();

}

module.exports = {
    getAllPrompts

};