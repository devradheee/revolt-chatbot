# Vercel Deployment Guide

## 🚀 **Step-by-Step Deployment Process**

### **Step 1: Prepare Your Repository**

1. **Push your code to GitHub:**
   ```bash
   git add .
   git commit -m "Ready for Vercel deployment"
   git push origin main
   ```

2. **Ensure your repository contains:**
   - `server.js` (main server file)
   - `package.json` (dependencies)
   - `vercel.json` (Vercel configuration)
   - `public/` folder (frontend files)
   - `.env` file (for local testing only)

### **Step 2: Deploy to Vercel**

1. **Go to Vercel Dashboard:**
   - Visit: https://vercel.com/dashboard
   - Sign in with GitHub

2. **Import Your Repository:**
   - Click "New Project"
   - Select your GitHub repository
   - Click "Import"

3. **Configure Environment Variables:**
   - In the project settings, go to "Environment Variables"
   - Add the following variables:
     ```
     GEMINI_API_KEY=your_actual_api_key_here
     NODE_ENV=production
     ```

4. **Deploy:**
   - Click "Deploy"
   - Wait for deployment to complete

### **Step 3: Update CORS Settings**

After deployment, update the CORS settings in `server.js`:

1. **Get your Vercel URL** (e.g., `https://your-app-name.vercel.app`)
2. **Update the CORS origins** in `server.js`:
   ```javascript
   origin: process.env.NODE_ENV === 'production' 
     ? ["https://your-app-name.vercel.app"] 
     : "*"
   ```

### **Step 4: Test Your Deployment**

1. **Visit your Vercel URL**
2. **Test the chat functionality**
3. **Check browser console for errors**

## 🔧 **Troubleshooting Common Issues**

### **Issue 1: Socket.IO Connection Failed**
**Solution:**
- Ensure CORS is properly configured
- Check that the Vercel URL is correct in server.js
- Verify environment variables are set

### **Issue 2: API Key Not Working**
**Solution:**
- Double-check the GEMINI_API_KEY in Vercel environment variables
- Ensure the API key is valid and has proper permissions
- Check server logs for API errors

### **Issue 3: Static Files Not Loading**
**Solution:**
- Ensure all files are in the `public/` folder
- Check that `vercel.json` routes are correct
- Verify file paths in HTML

### **Issue 4: Microphone Not Working**
**Solution:**
- HTTPS is required for microphone access
- Check browser permissions
- Test on different browsers

## 📝 **Environment Variables**

**Required for Vercel:**
```
GEMINI_API_KEY=your_api_key_here
NODE_ENV=production
```

**Optional:**
```
PORT=3001
```

## 🔍 **Testing Checklist**

- [ ] Server starts without errors
- [ ] Socket.IO connection established
- [ ] Text messages work
- [ ] Voice recording works (mock response)
- [ ] API responses are received
- [ ] No CORS errors in console
- [ ] All static files load properly

## 🚨 **Important Notes**

1. **API Key Security:** Never commit your API key to Git
2. **HTTPS Required:** Microphone access requires HTTPS
3. **CORS Configuration:** Update origins for your specific domain
4. **Environment Variables:** Set them in Vercel dashboard, not in code

## 📞 **Support**

If you encounter issues:
1. Check Vercel deployment logs
2. Review browser console errors
3. Verify environment variables
4. Test locally first 