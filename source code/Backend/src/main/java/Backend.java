import java.io.*;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.ZoneId;
import java.time.temporal.ChronoUnit;
import java.util.*;
import com.google.gson.*;
import com.mysql.cj.result.LocalDateValueFactory;
import jakarta.servlet.http.*;
import jakarta.servlet.annotation.*;
import jakarta.servlet.*;
import javax.sql.rowset.CachedRowSet;
import java.sql.Timestamp;

class POST
{
    public static final int ADD_USER = 1;
    public static final int USER_USAGE_INFO = 2;
    public static final int ADD_FRIEND = 3;
    public static final int COMPLETE_CHALLENGE = 4;
    public static final int JOIN_CHALLENGE = 5;
    public static final int SKIP_CHALLENGE = 6;
    public static final int RESPOND_FRIEND_REQUEST = 7;
    public static final int UPDATE_NOTIFICATION_FREQUENCY = 8;
    public static final int UPDATE_NOTIFICATION_TYPE = 9;
    public static final int ADD_NOTIFICATION_DATA = 10;
    public static final int UPDATE_NOTIFICATION_DATA = 11;
    public static final int REMOVE_NOTIFICATION_DATA = 12;
}

class GET
{
    public static final int GET_USER = 1;
    public static final int DATA_PAST_SEVEN_DAYS = 2;
    public static final int GET_FRIEND_REQUEST = 3;
    public static final int GET_CHALLENGES = 4;
    public static final int GET_USER_PROGRESS = 5;
    public static final int GET_ADVICE = 6;
    public static final int GET_NEWS = 7;
    public static final int GET_LEADERBOARD = 8;
    public static final int GET_FRIENDS_LEADERBOARD = 9;
    public static final int GET_NOTIFICATION_DATA = 10;
}

@WebServlet("/Backend")
public class Backend extends HttpServlet
{
    private SQL sql = null;
    private boolean operationSuccess = false;
    private JSON successJSON = null;

    @Override
    public void init() throws ServletException
    {
        try
        {
            sql = new SQL("jdbc:mysql://localhost:3306/cs160project", "root", "Pl00pst54.Ka9l3");
        }
        catch (Exception e)
        {
            sql = null;
            System.out.println(e);
        }
    }

    /** ALL REQUESTS/SEND SHOULD BE IN JSON **/

    /**
     * <p>
     *     Gets data from the database<br>
     * @param request From the frontend, ONLY READ ONCE
     * @param response To the frontend
     * */
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException
    {
        successJSON = new JSON();

        if (sql == null)
        {
            successJSON.getJSON().addProperty("success", false);
            printJSONResponse(response, successJSON);
            return;
        }

        response.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
        response.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        response.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With");
        response.setHeader("Access-Control-Allow-Credentials", "true");
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        int id = Integer.parseInt(request.getParameter("reqID"));

        // gets the password based on inputted username
        // http://localhost:8080/Backend/Backend?reqID=1&username=${username}&password=${password}
        if (id == GET.GET_USER)
        {
            String username = request.getParameter("username");
            String password = request.getParameter("password");

            String getPasswordQuery =
                    """
                    SELECT password FROM user U WHERE BINARY U.username = '%s';
                    """.formatted(username);

            try (CachedRowSet result = sql.executeQuery(getPasswordQuery))
            {
                // CachedRowSet starts before the first row
                if (result.next())
                {
                    String databasePass = result.getString("password");

                    if (databasePass.equals(password)) // password matches
                    {
                        operationSuccess = true;
                    }
                    else // password doesn't match
                    {
                        operationSuccess = false;
                    }
                }
                else // user not found
                {
                    operationSuccess = false;
                }
            }
            catch (SQLException e)
            {
                operationSuccess = false;
                System.out.println(e);
            }
        }
        // bar graph data from the past 7 days
        // url: http://localhost:8080/Backend/Backend?reqID=2&username=${username}
        else if (id == GET.DATA_PAST_SEVEN_DAYS)
        {
            String username = request.getParameter("username");
            int userID = getUserID(username);

            if (userID != -1)
            {
                String getWaterData =
                        """
                        SELECT gallons, datelogged FROM waterusage WHERE userid = %s ORDER BY datelogged desc;
                        """.formatted(userID);

                String getElectricityData =
                        """
                        SELECT kilowatthour, datelogged FROM electricityusage WHERE userid = %s ORDER BY datelogged desc;
                        """.formatted(userID);

                String getGasData =
                        """
                        SELECT cubicfeet, datelogged FROM gasusage WHERE userid = %s ORDER BY datelogged desc;
                        """.formatted(userID);

                try
                {
                    CachedRowSet waterData = sql.executeQuery(getWaterData);
                    CachedRowSet electricityData = sql.executeQuery(getElectricityData);
                    CachedRowSet gasData = sql.executeQuery(getGasData);

                    double[] waterResult = getDataLast7Days(waterData, "gallons");
                    double[] electricityResult = getDataLast7Days(electricityData, "kilowatthour");
                    double[] gasResult = getDataLast7Days(gasData, "cubicfeet");

                    Gson gson = new Gson();

                    String water = gson.toJson(waterResult);
                    successJSON.getJSON().addProperty("water", water);

                    String electricity = gson.toJson(electricityResult);
                    successJSON.getJSON().addProperty("electricity", electricity);

                    String gas = gson.toJson(gasResult);
                    successJSON.getJSON().addProperty("gas", gas);

                    operationSuccess = true;
                }
                catch (SQLException e)
                {
                    operationSuccess = false;
                    System.out.println(e);
                }
            }
            else
            {
                operationSuccess = false;
            }
        }
        // get list of friends to display
        // url: http://localhost:8080/Backend/Backend?reqID=3&username=${username}
        else if (id == GET.GET_FRIEND_REQUEST)
        {
            String username = request.getParameter("username");

            try {
                int userID = getUserID(username);
                String friendsQuery = """
                    SELECT U.UserID, U.Username
                    FROM Friend F
                    JOIN User U ON
                        (U.UserID = F.ReceiverID AND F.SenderID = %s)
                        OR
                        (U.UserID = F.SenderID AND F.ReceiverID = %s)
                    WHERE U.UserID != %s AND F.RequestStatus = 'pending';
                """.formatted(userID, userID, userID);

                CachedRowSet result = sql.executeQuery(friendsQuery);
                JsonArray friends = new JsonArray();

                while (result.next()) {
                    JsonObject obj = new JsonObject();
                    obj.addProperty("id", result.getString("UserID"));
                    obj.addProperty("username", result.getString("Username"));
                    // obj.addProperty("status", result.getString("RequestStatus"));
                    friends.add(obj);
                }

                successJSON.getJSON().add("friends", friends);
                operationSuccess = true;
            } catch (SQLException e) {
                operationSuccess = false;
                System.out.println(e);
            }
        }
        // get list of all available challenges
        // url: http://localhost:8080/Backend/Backend?reqID=4
        else if (id == GET.GET_CHALLENGES) {
            String query = """
                SELECT ChallengeID, Title, ChallengeDescription, UtilityType, ReductionTarget, StartDate, EndDate, RewardPoints
                FROM Challenge
                WHERE StartDate <= CURRENT_DATE AND EndDate >= CURRENT_DATE;
            """;

            try (CachedRowSet result = sql.executeQuery(query)) {
                JsonArray challenges = new JsonArray();

                while (result.next()) {
                    JsonObject chal = new JsonObject();
                    chal.addProperty("id", result.getInt("ChallengeID"));
                    chal.addProperty("title", result.getString("Title"));
                    chal.addProperty("description", result.getString("ChallengeDescription"));
                    chal.addProperty("utility", result.getString("UtilityType"));
                    chal.addProperty("reductionTarget", result.getDouble("ReductionTarget"));
                    chal.addProperty("startDate", result.getString("StartDate"));
                    chal.addProperty("endDate", result.getString("EndDate"));
                    chal.addProperty("points", result.getInt("RewardPoints"));
                    challenges.add(chal);
                }

                successJSON.getJSON().add("challenges", challenges);
                operationSuccess = true;
            } catch (SQLException e) {
                operationSuccess = false;
                System.out.println(e);
            }
        }
        // get list of all challenges the user is participating in and their progress
        // url: http://localhost:8080/Backend/Backend?reqID=5&username=${username}
        else if (id == GET.GET_USER_PROGRESS)
        {
            String username = request.getParameter("username");

            try {
                int userID = getUserID(username);

                String query = """
                    SELECT C.ChallengeID, C.Title, C.UtilityType, C.StartDate, C.EndDate, C.RewardPoints, UCP.ChallengeStatus, UCP.DateCompleted, UCP.PointsEarned
                    FROM UserChallengeProgress UCP
                    JOIN Challenge C ON UCP.ChallengeID = C.ChallengeID
                    WHERE UCP.UserID = %s;
                """.formatted(userID);

                CachedRowSet result = sql.executeQuery(query);
                JsonArray progressArray = new JsonArray();

                while (result.next()) {
                    JsonObject progress = new JsonObject();
                    progress.addProperty("id", result.getInt("ChallengeID"));
                    progress.addProperty("title", result.getString("Title"));
                    progress.addProperty("utility", result.getString("UtilityType"));
                    progress.addProperty("startDate", result.getString("StartDate"));
                    progress.addProperty("endDate", result.getString("EndDate"));
                    progress.addProperty("points", result.getInt("RewardPoints"));
                    progress.addProperty("status", result.getString("ChallengeStatus"));
                    progress.addProperty("completeDate", result.getString("DateCompleted"));
                    progress.addProperty("pointsEarned", result.getInt("PointsEarned"));
                    progressArray.add(progress);
                }

                successJSON.getJSON().add("progress", progressArray);
                operationSuccess = true;
            } catch (SQLException e) {
                operationSuccess = false;
                System.out.println(e);
            }
        }
        // get list of advice messages for all types of utilities
        // url: http://localhost:8080/Backend/Backend?reqID=6
        else if (id == GET.GET_ADVICE)
        {
            String waterAdviceTierQuery = ""; // Will be filled depending on usage
            String electricityAdviceTierQuery = ""; // Will be filled depending on usage
            String gasAdviceTierQuery = ""; // Will be filled depending on usage

            double waterUsage = Double.parseDouble(request.getParameter("water"));
            double electricityUsage = Double.parseDouble(request.getParameter("electricity"));
            double gasUsage = Double.parseDouble(request.getParameter("gas"));

            if (waterUsage < 201.6) {
                // light water advice
                waterAdviceTierQuery = """
                    SELECT Title, Content FROM Advice
                    WHERE UtilityType = 'water'
                    AND AdviceID IN (1, 2, 3) -- light water advice IDs
                    ORDER BY RAND() LIMIT 1;
                """;
            } else {
                // stronger advice
                waterAdviceTierQuery = """
                    SELECT Title, Content FROM Advice
                    WHERE UtilityType = 'water'
                    AND AdviceID IN (4, 5, 6) -- strong water advice IDs
                    ORDER BY RAND() LIMIT 1;
                """;
            }

            if (electricityUsage < 26.2) {
                electricityAdviceTierQuery = """
                    SELECT Title, Content FROM Advice
                    WHERE UtilityType = 'electricity'
                    AND AdviceID IN (7, 8, 9)
                    ORDER BY RAND() LIMIT 1;
                """;
            } else {
                electricityAdviceTierQuery = """
                    SELECT Title, Content FROM Advice
                    WHERE UtilityType = 'electricity'
                    AND AdviceID IN (10, 11, 12)
                    ORDER BY RAND() LIMIT 1;
                """;
            }

            if (gasUsage < 93.3) {
                gasAdviceTierQuery = """
                    SELECT Title, Content FROM Advice
                    WHERE UtilityType = 'gas'
                    AND AdviceID IN (13, 14, 15)
                    ORDER BY RAND() LIMIT 1;
                """;
            } else {
                gasAdviceTierQuery = """
                    SELECT Title, Content FROM Advice
                    WHERE UtilityType = 'gas'
                    AND AdviceID IN (16, 17, 18)
                    ORDER BY RAND() LIMIT 1;
                """;
            }

            try (CachedRowSet result = sql.executeQuery(waterAdviceTierQuery)) {
                if (result.next()) {
                    JsonObject advice = new JsonObject();
                    advice.addProperty("title", result.getString("Title"));
                    advice.addProperty("content", result.getString("Content"));
                    successJSON.getJSON().add("waterAdvice", advice);
                    operationSuccess = true;
                } else {
                    operationSuccess = false; // no advice found
                }
            }
            catch (SQLException e) {
                operationSuccess = false;
                System.out.println(e);
            }

            try (CachedRowSet result = sql.executeQuery(electricityAdviceTierQuery)) {
                if (result.next()) {
                    JsonObject advice = new JsonObject();
                    advice.addProperty("title", result.getString("Title"));
                    advice.addProperty("content", result.getString("Content"));
                    successJSON.getJSON().add("electricityAdvice", advice);
                    operationSuccess = true;
                } else {
                    operationSuccess = false; // no advice found
                }
            }
            catch (SQLException e) {
                operationSuccess = false;
                System.out.println(e);
            }

            try (CachedRowSet result = sql.executeQuery(gasAdviceTierQuery)) {
                if (result.next()) {
                    JsonObject advice = new JsonObject();
                    advice.addProperty("title", result.getString("Title"));
                    advice.addProperty("content", result.getString("Content"));
                    successJSON.getJSON().add("gasAdvice", advice);
                    operationSuccess = true;
                } else {
                    operationSuccess = false; // no advice found
                }
            }
            catch (SQLException e) {
                operationSuccess = false;
                System.out.println(e);
            }
        }
        // get list of news articles to display
        // url: http://localhost:8080/Backend/Backend?reqID=7
        else if (id == GET.GET_NEWS)
        {
            String query = "SELECT Title, URL, Source FROM News";

            try (CachedRowSet result = sql.executeQuery(query)) {
                JsonArray newsArray = new JsonArray();

                while (result.next()) {
                    JsonObject news = new JsonObject();
                    news.addProperty("title", result.getString("Title"));
                    news.addProperty("url", result.getString("URL"));
                    news.addProperty("source", result.getString("Source"));
                    newsArray.add(news);
                }

                successJSON.getJSON().add("news", newsArray);
                operationSuccess = true;
            } catch (SQLException e) {
                operationSuccess = false;
                System.out.println(e);
            }
        }
        // get leaderboard based on the friends on the current user
        // url: http://localhost:8080/Backend/Backend?reqID=8&username=${username}
        else if (id == GET.GET_LEADERBOARD)
        {
            String username = request.getParameter("username");

            try {
                int userID = getUserID(username);

                // Query to get user's total points
                String userPointsQuery = """
                    SELECT Username, SUM(PointsEarned) AS TotalPoints, COUNT(*) AS ChallengesCompleted
                    FROM User U
                    JOIN UserChallengeProgress UCP ON U.UserID = UCP.UserID
                    WHERE U.UserID = %s AND UCP.ChallengeStatus = 'completed'
                    GROUP BY U.UserID;
                """.formatted(userID);

                // Query to get friend's total points
                String allUsersPointsQuery = """
                    SELECT U.UserID, U.Username, SUM(UCP.PointsEarned) AS TotalPoints, COUNT(*) AS ChallengesCompleted
                    FROM User U
                    JOIN UserChallengeProgress UCP ON U.UserID = UCP.UserID
                    WHERE UCP.ChallengeStatus = 'completed' AND NOT U.UserID = %s
                    GROUP BY U.UserID
                    ORDER BY TotalPoints DESC;
                """.formatted(userID);

                // Execute queries
                CachedRowSet userResult = sql.executeQuery(userPointsQuery);
                CachedRowSet allUsersResult = sql.executeQuery(allUsersPointsQuery);

                JsonArray leaderboard = new JsonArray();

                // Add self to top
                if (userResult.next()) {
                    JsonObject self = new JsonObject();
                    self.addProperty("id", userID);
                    self.addProperty("username", userResult.getString("Username"));
                    self.addProperty("points", userResult.getInt("TotalPoints"));
                    self.addProperty("challengesCompleted", userResult.getInt("ChallengesCompleted"));
                    self.addProperty("isUser", true); // frontend can highlight the logged-in user
                    leaderboard.add(self);
                }

                // Add other users
                int count = 0;
                while (allUsersResult.next() && count < 5) {
                    count++;
                    JsonObject entry = new JsonObject();
                    entry.addProperty("id", allUsersResult.getInt("UserID"));
                    entry.addProperty("username", allUsersResult.getString("Username"));
                    entry.addProperty("points", allUsersResult.getInt("TotalPoints"));
                    entry.addProperty("challengesCompleted", allUsersResult.getInt("ChallengesCompleted"));
                    entry.addProperty("isUser", false);
                    leaderboard.add(entry);
                }

                successJSON.getJSON().add("leaderboard", leaderboard);
                operationSuccess = true;
            }
            catch (SQLException e) {
                operationSuccess = false;
                System.out.println(e);
            }
        }
        // get leaderboard based on the friends on the current user
        // url: http://localhost:8080/Backend/Backend?reqID=9&username=${username}
        else if (id == GET.GET_FRIENDS_LEADERBOARD)
        {
            String username = request.getParameter("username");

            try {
                int userID = getUserID(username);

                // Query to get friend's total points
                String friendPointsQuery = """
                    SELECT U.UserID, U.Username, SUM(UCP.PointsEarned) AS TotalPoints, COUNT(*) AS ChallengesCompleted
                    FROM Friend F
                    JOIN User U ON 
                        (U.UserID = F.ReceiverID AND F.SenderID = %s)
                        OR 
                        (U.UserID = F.SenderID AND F.ReceiverID = %s)
                    JOIN UserChallengeProgress UCP ON U.UserID = UCP.UserID
                    WHERE F.RequestStatus = 'accepted'
                    GROUP BY U.Username
                    ORDER BY TotalPoints DESC;
                """.formatted(userID, userID);

                String otherFriendsQuery = """
                    SELECT U.UserID, U.Username
                    FROM Friend F
                    JOIN User U ON 
                        (U.UserID = F.ReceiverID AND F.SenderID = %s)
                        OR 
                        (U.UserID = F.SenderID AND F.ReceiverID = %s)
                    WHERE F.RequestStatus = 'accepted' AND U.UserID NOT IN (SELECT C.UserID FROM UserChallengeProgress C)
                """.formatted(userID, userID);

                // Execute queries
                CachedRowSet friendsResult = sql.executeQuery(friendPointsQuery);
                CachedRowSet otherFriendsResult = sql.executeQuery(otherFriendsQuery);

                JsonArray leaderboard = new JsonArray();

                // Add friends
                while (friendsResult.next()) {
                    JsonObject entry = new JsonObject();
                    entry.addProperty("id", friendsResult.getInt("UserID"));
                    entry.addProperty("username", friendsResult.getString("Username"));
                    entry.addProperty("points", friendsResult.getInt("TotalPoints"));
                    entry.addProperty("challengesCompleted", friendsResult.getInt("ChallengesCompleted"));
                    entry.addProperty("isUser", false);
                    leaderboard.add(entry);
                }

                while (otherFriendsResult.next()) {
                    JsonObject entry = new JsonObject();
                    entry.addProperty("id", otherFriendsResult.getInt("UserID"));
                    entry.addProperty("username", otherFriendsResult.getString("Username"));
                    entry.addProperty("points", 0);
                    entry.addProperty("challengesCompleted", 0);
                    entry.addProperty("isUser", false);
                    leaderboard.add(entry);
                }

                successJSON.getJSON().add("friends", leaderboard);
                operationSuccess = true;
            }
            catch (SQLException e) {
                operationSuccess = false;
                System.out.println(e);
            }
        }
        else if (id == GET.GET_NOTIFICATION_DATA)
        {
            String username = request.getParameter("username");

            try {
                int userID = getUserID(username);

                String getNotificationsQuery = """
                    SELECT * FROM Notifications WHERE UserID = %s
                """.formatted(userID);

                JsonArray notifArray = new JsonArray();

                // Execute queries
                CachedRowSet notifications = sql.executeQuery(getNotificationsQuery);
                while (notifications.next())
                {
                    JsonObject notif = new JsonObject();
                    notif.addProperty("id", notifications.getString("NotificationID"));
                    notif.addProperty("status", notifications.getString("NotificationStatus"));
                    notif.addProperty("text", notifications.getString("Notification"));
                    notif.addProperty("type", notifications.getString("NotificationType"));

                    notifArray.add(notif);
                }

                successJSON.getJSON().add("notifications", notifArray);

                operationSuccess = true;
            }
            catch (SQLException e)
            {
                operationSuccess = false;
                System.out.println(e);
            }
        }

        successJSON.getJSON().addProperty("success", operationSuccess);
        printJSONResponse(response, successJSON);
    }

    /**
     * <p>
     *     Sends data to the database<br>
     * @param request From the frontend
     * @param response To the frontend, ONLY READ ONCE
     * */
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException
    {
        successJSON = new JSON();

        if (sql == null)
        {
            successJSON.getJSON().addProperty("success", false);
            printJSONResponse(response, successJSON);
            return;
        }

        response.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
        response.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        response.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With");
        response.setHeader("Access-Control-Allow-Credentials", "true");

        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        JSON jsonParser = new JSON();
        jsonParser.parseRequestBody(request);
        int id = jsonParser.getNumber("reqID").intValue();

        // add new user to database
        // reqID=1
        if (id == POST.ADD_USER)
        {
            String username = jsonParser.getString("username");
            String password = jsonParser.getString("password");
            String email = jsonParser.getString("email");
            String phone = jsonParser.getString("phone");

            // mySQL database already checks for unique username and email
            try
            {
                String addUserQuery =
                        """
                        INSERT INTO User (Username, Password, Email, Phone)
                        VALUES ('%s', '%s', '%s', '%s');
                        """.formatted(username, password, email, phone);
                sql.executeUpdate(addUserQuery);

                operationSuccess = true;
            }
            catch (SQLException e)
            {
                operationSuccess = false;
                System.out.println(e);
            }
        }
        // posts user's usage data to the database
        // reqID=2
        else if (id == POST.USER_USAGE_INFO)
        {
            double water = jsonParser.getNumber("waterUsage").doubleValue();
            double electricity = jsonParser.getNumber("electricityUsage").doubleValue();
            double gas = jsonParser.getNumber("gasUsage").doubleValue();
            String username = jsonParser.getString("username");
            int userID = getUserID(username);

            if (userID != -1)
            {
                try
                {
                    addWaterUsage(userID, water);
                    addElectricityUsage(userID, electricity);
                    addGasUsage(userID, gas);

                    operationSuccess = true;
                }
                catch (SQLException e)
                {
                    operationSuccess = false;
                    System.out.println(e);
                }
            }
            else
            {
                operationSuccess = false;
            }
        }
        // add a friend
        // reqID=3
        else if (id == POST.ADD_FRIEND)
        {
            String sender = jsonParser.getString("sender");
            String receiver = jsonParser.getString("receiver");

            try {
                int senderID = getUserID(sender);
                int receiverID = getUserID(receiver);

                boolean existingRequest = false;
                String getExistingFriends = """
                    SELECT * FROM FRIEND
                """;
                CachedRowSet exstFr = sql.executeQuery(getExistingFriends);
                while (exstFr.next())
                {
                    int sID = exstFr.getInt("SenderID");
                    int rID = exstFr.getInt("ReceiverID");
                    String status = exstFr.getString("RequestStatus");

                    // request already sent
                    if ((sID == senderID && rID == receiverID) && status.equals("pending"))
                    {
                        existingRequest = true;
                        break;
                    }

                    // friend already exists
                    if (((sID == senderID && rID == receiverID) || (rID == senderID && sID == receiverID)) && status.equals("accepted"))
                    {
                        existingRequest = true;
                        break;
                    }
                }

                if (senderID == receiverID)
                {
                    existingRequest = true;
                }

                if (!existingRequest)
                {
                    String addFriendQuery = """
                    INSERT INTO Friend (SenderID, ReceiverID, RequestStatus)
                    VALUES (%s, %s, 'pending');
                """.formatted(senderID, receiverID);
                    sql.executeUpdate(addFriendQuery);
                    operationSuccess = true;
                }
                else
                {
                    operationSuccess = false;
                }
            } catch (SQLException e) {
                operationSuccess = false;
                System.out.println(e);
            }
        }
        // complete the challenge the user was participating in
        // reqID=4
        else if (id == POST.COMPLETE_CHALLENGE)
        {
            String username = jsonParser.getString("username");
            int userID = getUserID(username);
            int challengeID = jsonParser.getNumber("challengeID").intValue();
            int points = getPointsEarned(challengeID);
            String userResponse = jsonParser.getString("userResponse");

            String completeChallengeQuery = """
                UPDATE UserChallengeProgress
                SET ChallengeStatus = 'completed',
                    PointsEarned = %s,
                    UserResponse = '%s',
                    DateCompleted = CURRENT_DATE
                WHERE UserID = %s AND ChallengeID = %s;
            """.formatted(points, userResponse, userID, challengeID);

            try {
                sql.executeUpdate(completeChallengeQuery);
                operationSuccess = true;
            } catch (SQLException e) {
                operationSuccess = false;
                System.out.println(e);
            }
        }
        // reqID=5
        else if (id == POST.JOIN_CHALLENGE)
        {
            String username = jsonParser.getString("username");
            int userID = getUserID(username);
            int challengeID = jsonParser.getNumber("challengeID").intValue();

            try {
                String joinChallengeQuery = """
                    INSERT INTO UserChallengeProgress (UserID, ChallengeID)
                    VALUES (%s, %s);
                """.formatted(userID, challengeID);

                sql.executeUpdate(joinChallengeQuery);
                operationSuccess = true;
            } catch (SQLException e) {
                operationSuccess = false;
                System.out.println(e);
            }
        }
        // reqID=6
        else if (id == POST.SKIP_CHALLENGE)
        {
            String username = jsonParser.getString("username");
            int userID = getUserID(username);
            int challengeID = jsonParser.getNumber("challengeID").intValue();

            try {
                String skipChallengeQuery = """
                    UPDATE UserChallengeProgress
                    SET ChallengeStatus = 'skipped',
                        PointsEarned = 0,
                        DateCompleted = CURRENT_DATE
                    WHERE UserID = %s AND ChallengeID = %s;
                """.formatted(userID, challengeID);

                sql.executeUpdate(skipChallengeQuery);
                operationSuccess = true;
            } catch (SQLException e) {
                operationSuccess = false;
                System.out.println(e);
            }
        }
        // user responds to incoming friend request
        // reqID=7
        else if (id == POST.RESPOND_FRIEND_REQUEST)
        {
            String sender = jsonParser.getString("sender");
            String receiver = jsonParser.getString("receiver");
            String action = jsonParser.getString("action"); // "accept" or "reject"

            try {
                int senderID = getUserID(sender);
                int receiverID = getUserID(receiver);

                // senderID + receiverID = Primary key...
                // single rejection means the sender can't send a request anymore!!!!
                if (action.equals("rejected"))
                {
                    String deleteQuery = """
                        DELETE FROM Friend
                        WHERE SenderID = %s AND ReceiverID = %s;
                    """.formatted(senderID, receiverID);
                    sql.executeUpdate(deleteQuery);
                    operationSuccess = true;
                }
                else
                {
                    String updateQuery = """
                    UPDATE Friend
                    SET RequestStatus = '%s'
                    WHERE SenderID = %s AND ReceiverID = %s;
                """.formatted(action, senderID, receiverID);

                    sql.executeUpdate(updateQuery);
                    operationSuccess = true;
                }
            } catch (SQLException e) {
                operationSuccess = false;
                System.out.println(e);
            }
        }
        // update user's notification frequency
        // reqID=8
        else if (id == POST.UPDATE_NOTIFICATION_FREQUENCY)
        {
            String notificationFreq = jsonParser.getString("notificationFreq");
            String username = jsonParser.getString("username");
            int userID = getUserID(username);

            if (userID != -1)
            {
                try
                {
                    String updateNotificationFreq =
                            """
                            UPDATE user SET NotificationFrequency = '%s' WHERE userid = %s;
                            """.formatted(notificationFreq, userID);
                    sql.executeUpdate(updateNotificationFreq);

                    operationSuccess = true;
                }
                catch (SQLException e)
                {
                    operationSuccess = false;
                    System.out.println(e);
                }
            }
            else
            {
                operationSuccess = false;
            }
        }
        // update user's notification type
        // reqID=9
        else if (id == POST.UPDATE_NOTIFICATION_TYPE)
        {
            String notificationType = jsonParser.getString("notificationType");
            String username = jsonParser.getString("username");
            int userID = getUserID(username);

            if (userID != -1)
            {
                try
                {
                    String updateNotificationType =
                            """
                            UPDATE user SET notificationtype = '%s' WHERE userid = %s;
                            """.formatted(notificationType, userID);
                    sql.executeUpdate(updateNotificationType);

                    operationSuccess = true;
                }
                catch (SQLException e)
                {
                    operationSuccess = false;
                    System.out.println(e);
                }
            }
            else
            {
                operationSuccess = false;
            }
        }
        else if (id == POST.ADD_NOTIFICATION_DATA)
        {
            String username = jsonParser.getString("username");
            int userID = getUserID(username);
            String notifText = jsonParser.getString("text");
            String notifType = jsonParser.getString("type");

            try
            {
                String addNotification =
                        """
                        INSERT INTO Notifications (UserID, Notification, NotificationType)
                        VALUES (%s, '%s', '%s');
                        """.formatted(userID, notifText, notifType);
                sql.executeUpdate(addNotification);

                operationSuccess = true;
            }
            catch (SQLException e)
            {
                operationSuccess = false;
                System.out.println(e);
            }
        }
        else if (id == POST.UPDATE_NOTIFICATION_DATA)
        {
            int notifID = jsonParser.getNumber("id").intValue();
            String notifStatus = jsonParser.getString("status");

            try
            {
                String updateNotification =
                        """
                        UPDATE Notifications
                        SET NotificationStatus = '%s'
                        WHERE NotificationID = %s;
                        """.formatted(notifStatus, notifID);
                sql.executeUpdate(updateNotification);

                operationSuccess = true;
            }
            catch (SQLException e)
            {
                operationSuccess = false;
                System.out.println(e);
            }
        }
        else if (id == POST.REMOVE_NOTIFICATION_DATA)
        {
            String username = jsonParser.getString("username");
            int userID = getUserID(username);

            try
            {
                String deleteNotification =
                        """
                        DELETE FROM Notifications
                        WHERE UserID = %s;
                        """.formatted(userID);
                sql.executeUpdate(deleteNotification);

                operationSuccess = true;
            }
            catch (SQLException e)
            {
                operationSuccess = false;
                System.out.println(e);
            }
        }

        successJSON.getJSON().addProperty("success", operationSuccess);
        printJSONResponse(response, successJSON);
    }

    @Override
    protected void doOptions(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException
    {
        response.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
        response.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        response.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With");
        response.setHeader("Access-Control-Allow-Credentials", "true");
        response.setStatus(HttpServletResponse.SC_OK);
    }

    void printJSONResponse(HttpServletResponse response, JSON json) throws IOException
    {
        PrintWriter res = response.getWriter();
        res.print(json.getJSON().toString());
        res.flush();
    }

    int getUserID(String username)
    {
        String getUserQuery =
                """
                SELECT UserID FROM user U WHERE BINARY U.username = '%s';
                """.formatted(username);

        try (CachedRowSet result = sql.executeQuery(getUserQuery))
        {
            if (result.next())
            {
                return result.getInt("UserID");
            }
            else
            {
                operationSuccess = false;
                throw new SQLException();
            }
        }
        catch (SQLException e)
        {
            operationSuccess = false;
            System.out.println(e);
        }

        return -1;
    }

    int getPointsEarned(int challengeID)
    {
        String getChallengeQuery =
                """
                SELECT RewardPoints FROM Challenge WHERE ChallengeID = %s;
                """.formatted(challengeID);

        try (CachedRowSet result = sql.executeQuery(getChallengeQuery))
        {
            if (result.next())
            {
                return result.getInt("RewardPoints");
            }
            else
            {
                operationSuccess = false;
                throw new SQLException();
            }
        }
        catch (SQLException e)
        {
            operationSuccess = false;
            System.out.println(e);
        }

        return -1;
    }

    void addWaterUsage(int userID, double water) throws SQLException
    {
        String addWaterUsage =
                """
                INSERT INTO WaterUsage (UserID, Gallons)
                VALUES (%s, %s);
                """.formatted(userID, water);
        sql.executeUpdate(addWaterUsage);

        /*
        Finds the most recent water usage entry
        Deletes anything older for the same day
        Keeps latest entry for each user
         */
        String deleteOldWater =
                """
                DELETE FROM WaterUsage
                WHERE WaterID NOT IN (
                  SELECT t.latestID
                  FROM (
                    SELECT MAX(WaterID) AS latestID
                    FROM WaterUsage
                    GROUP BY UserID, DATE(DateLogged)
                  ) AS t
                );
                """;
        sql.executeUpdate(deleteOldWater);
    }

    void addElectricityUsage(int userID, double electricity) throws SQLException
    {
        String addElectricityUsage =
                """
                INSERT INTO ElectricityUsage (UserID, KilowattHour)
                VALUES (%s, %s);
                """.formatted(userID, electricity);
        sql.executeUpdate(addElectricityUsage);

        /*
        Finds the most recent electricity usage entry
        Deletes anything older for the same day
        Keeps latest entry for each user
         */
        String deleteOldElectricity =
                """
                DELETE FROM ElectricityUsage
                WHERE ElectricityID NOT IN (
                  SELECT t.latestID
                  FROM (
                    SELECT MAX(ElectricityID) AS latestID
                    FROM ElectricityUsage
                    GROUP BY UserID, DATE(DateLogged)
                  ) AS t
                );
                """;
        sql.executeUpdate(deleteOldElectricity);
    }

    void addGasUsage(int userID, double gas) throws SQLException
    {
        String addGasUsage =
                """
                INSERT INTO GasUsage (UserID, CubicFeet)
                VALUES (%s, %s);
                """.formatted(userID, gas);
        sql.executeUpdate(addGasUsage);

        /*
        Finds the most recent gas usage entry
        Deletes anything older for the same day
        Keeps latest entry for each user
         */
        String deleteOldGas =
                """
                DELETE FROM GasUsage
                WHERE GasID NOT IN (
                  SELECT t.latestID
                  FROM (
                    SELECT MAX(GasID) AS latestID
                    FROM GasUsage
                    GROUP BY UserID, DATE(DateLogged)
                  ) AS t
                );
                """;
        sql.executeUpdate(deleteOldGas);
    }

    /**
     * @param data Contains MySQL numbers and timestamps, nothing else
     * @param columnKey String for the column name
     * @return
     * Double array of size 7 containing usage data <br>
     * If past 7 days contains less than 7 parts of data, empty elements will contain -1
     */
    double[] getDataLast7Days(CachedRowSet data, String columnKey) throws SQLException
    {
        double[] result = new double[7];
        int currentIndex = 0;

        // correct data will overwrite the "missing" data
        for (int i = 0; i < 7; i++)
        {
            result[i] = -1;
        }

        LocalDate today = LocalDate.now();
        LocalDate lastDay = today.minusDays(7);

        while (data.next())
        {
            Timestamp sqlDate = data.getTimestamp("DateLogged");
            LocalDate localSQLDate = sqlDate.toLocalDateTime().toLocalDate();
            double val = data.getDouble(columnKey);

            if (localSQLDate.isAfter(lastDay))
            {
                int daysBetween = (int)(ChronoUnit.DAYS.between(localSQLDate, today));
                result[daysBetween] = val;
            }
        }

        return result;
    }
}