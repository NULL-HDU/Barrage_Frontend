export default {
    // skill
    LEFT_SKILL: "leftSkill",
    RIGHT_SKILL: "rightSkill",
    Q_SKILL: "qSkill",
    E_DEFEND_SKILL: "eDefendSkill",

    NORMAL_SKILL_CD: 500,
    E_SKILL_CD: 1000 * 8,
    Q_SKILL_CD: 1000,
    E_SKILL_DURATION: 1000 * 4,
    SKILL_CHECK_LOOP_INTERVAL: 50,

    // quadtree
    QUAD_BALL_AMOUNT: 4,
    QUAD_TREE_DEPTH: 30,

    // airPlane and bullet
    AIRPLANE_SPEED: 2.5,
    AIRPLANE_SLOW_RATE: 0.3,
    BULLET_SPEED: 200, // px / s

    // loops
    BULLET_MAKER_LOOP_INTERVAL: (1 / 5) * 1000,
    BULLET_MAKER_DEMO_LOOP_INTERVAL: (1 / 10) * 1000,
    BULLET_COLLECTING_INTERVAL: (1 / 30) * 1000,
    GAME_LOOP_INTERVAL: 10,
    SOCKET_LOOP_INTERVAL: 30,
    VIEW_LOOP_INTERVAL: 10,
    //BULLET_COLLISION_DETECTION_INTERVAL: ((1/180)*1000),

    LOCAL_HEIGHT: window.screen.height,
    LOCAL_WIDTH: window.screen.width,

};
