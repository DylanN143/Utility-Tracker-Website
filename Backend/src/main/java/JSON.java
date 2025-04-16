import com.google.gson.*;
import jakarta.servlet.http.HttpServletRequest;
import java.io.BufferedReader;
import java.io.IOException;

public class JSON
{
    private JsonObject json = null;

    /**
     * HTTP REQUEST ONLY CAN BE PARSED ONCE!!
     */
    public JSON()
    {
        json = new JsonObject();
    }

    public void parseRequestBody(HttpServletRequest request) throws IOException
    {
        StringBuilder res = new StringBuilder();
        BufferedReader b = request.getReader();

        String line;
        while ((line = b.readLine()) != null)
        {
            res.append(line);
        }

        Gson gson = new Gson();

        json = gson.fromJson(res.toString(), JsonObject.class);
    }

    public Number getNumber(String attributeName) throws IOException
    {
        return json.get(attributeName).getAsNumber();
    }

    public JsonArray getArray(String attributeName) throws IOException
    {
        return json.get(attributeName).getAsJsonArray();
    }

    public boolean getBool(String attributeName) throws IOException
    {
        return json.get(attributeName).getAsBoolean();
    }

    public String getString(String attributeName) throws IOException
    {
        return json.get(attributeName).getAsString();
    }

    public JsonObject getJSON()
    {
        return json;
    }
}
